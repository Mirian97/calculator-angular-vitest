import {
  CalculatorService,
  operators,
} from '@/calculator/services/calculator.service';
import { TestBed } from '@angular/core/testing';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
    vi.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with default values', () => {
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should set resultText, subResultText to "0" when C is pressed', () => {
    service.resultText.set('123');
    service.subResultText.set('456');
    service.lastOperator.set('-');

    service.constructNumber('C');

    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should update resultText with number input', () => {
    service.constructNumber('1');
    service.constructNumber('5');
    expect(service.resultText()).toBe('15');
  });

  it('shoud handle operators correctly', () => {
    operators.forEach((operator) => {
      service.resultText.set('12');
      service.constructNumber(operator);
      expect(service.resultText()).toBe('0');
      expect(service.lastOperator()).toBe(operator);
    });
  });

  it('should calculate result for addition', () => {
    service.constructNumber('1');
    service.constructNumber('+');
    service.constructNumber('8');
    service.constructNumber('=');
    expect(service.resultText()).toBe('9');
  });

  it('should calculate result for subtraction', () => {
    service.constructNumber('1');
    service.constructNumber('-');
    service.constructNumber('8');
    service.constructNumber('=');
    expect(service.resultText()).toBe('-7');
  });

  it('should calculate result for multiplication', () => {
    service.constructNumber('4');
    service.constructNumber('*');
    service.constructNumber('5');
    service.constructNumber('=');
    expect(service.resultText()).toBe('20');
  });

  it('should calculate result for division', () => {
    service.constructNumber('9');
    service.constructNumber('÷');
    service.constructNumber('3');
    service.constructNumber('=');
    expect(service.resultText()).toBe('3');
  });

  it('should handle decimal point', () => {
    service.constructNumber('0');
    service.constructNumber('.');
    service.constructNumber('7');
    expect(service.resultText()).toBe('0.7');
    service.constructNumber('.');
    expect(service.resultText()).toBe('0.7');
  });

  it('should handle sign change +/-', () => {
    service.resultText.set('1004');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('-1004');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('1004');
  });

  it('should handle backspace', () => {
    service.resultText.set('2026');
    service.constructNumber('Backspace');
    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('20');
  });

  it('should handle backspace with negative numbers', () => {
    service.resultText.set('-2125');
    service.constructNumber('Backspace');
    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('-21');
  });

  it('should handle max length', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    consoleSpy.mockImplementation(() => {});

    for (let i = 0; i < 20; i++) {
      service.constructNumber('8');
    }

    expect(service.resultText().length).toBe(10);
    expect(service.resultText()).toBe('8888888888');
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledTimes(10);
  });

  it('should handle with invalid input', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    service.resultText.set('90');
    service.constructNumber('&');

    expect(service.resultText()).toBe('90');

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Invalid input', '&');
  });
});
