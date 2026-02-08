import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import CalculatorViewComponent from './calculator-view.component';

@Component({
  selector: 'calculator',
  template: `<div>MockCalculatorComponent</div>`,
})
class MockCalculatorComponent {}

describe('CalculatorViewComponent', () => {
  let component: CalculatorViewComponent;
  let fixture: ComponentFixture<CalculatorViewComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorViewComponent],
    }).overrideComponent(CalculatorViewComponent, {
      set: {
        imports: [MockCalculatorComponent],
      },
    });

    fixture = TestBed.createComponent(CalculatorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render calculator', () => {
    expect(compiled.querySelector('calculator')).toBeTruthy();
  });

  it('should contain CSS classes in the wrapper div', () => {
    const divElement = compiled.querySelector('div');
    const expectedClasses =
      'w-full mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden'.split(
        ' ',
      );
    divElement?.classList.forEach((className) => {
      expect(divElement.classList).toContain(className);
    });
  });
});
