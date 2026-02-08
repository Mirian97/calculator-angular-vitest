import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorButtonComponent } from './calculator-button.component';

describe('CalculatorButtonComponent', () => {
  let component: CalculatorButtonComponent;
  let fixture: ComponentFixture<CalculatorButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorButtonComponent],
    });
    fixture = TestBed.createComponent(CalculatorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.resetAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should apply w-1/4 double size is false', () => {
    const htmlElement = fixture.nativeElement;
    const hostClass = htmlElement.classList.value;
    expect(hostClass).toContain('w-1/4');
  });

  it('should apply w-2/4 double size is true', () => {
    fixture.componentRef.setInput('isDoubleSize', true);
    fixture.detectChanges();
    const htmlElement = fixture.nativeElement;
    const hostClass = htmlElement.classList.value;
    expect(hostClass).toContain('w-2/4');
  });

  it('should apply is-command class when isCommand is true', () => {
    fixture.componentRef.setInput('isCommand', true);
    fixture.detectChanges();
    const htmlElement = fixture.nativeElement;
    const hostClass = htmlElement.classList.value;
    expect(hostClass).toContain('is-command');
  });

  it('should emit onClick when handleClick is called', () => {
    const spyClick = vi.spyOn(component.onClick, 'emit');
    const buttonElement = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    );
    buttonElement!.innerHTML = ' 9 ';
    buttonElement!.click();

    expect(buttonElement).toBeTruthy();
    expect(spyClick).toHaveBeenCalled();
    expect(spyClick).toHaveBeenCalledWith('9');
  });

  // it('should set isPressed to true and then false when KeyboardPressedStyle', () => {});

  // it('should not set isPressed if key does not match', () => {});

  // it('should display projected content', () => {});
});
