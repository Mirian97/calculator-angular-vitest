import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'zoneless-calculator' title`, () => {
    expect(app.title).toEqual('zoneless-calculator');
  });

  it('should render router-outlet', () => {
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should render router-outlet with css classes', () => {
    const divElement = compiled.querySelector('div');
    const mostHaveClasses =
      'min-w-screen min-h-screen bg-slate-600 flex items-center justify-center px-5 py-5'.split(
        ' ',
      );
    divElement?.classList.forEach((className) =>
      expect(mostHaveClasses).toContain(className),
    );
  });

  it('should render buy me a drink link', () => {
    const linkElement = compiled.querySelector('a');

    expect(linkElement?.title).toMatch(/buy me a beer/i);
    expect(linkElement?.getAttribute('title')).toMatch(/buy me a beer/i);
    expect(linkElement?.getAttribute('target')).toBe('_blank');
    expect(linkElement?.getAttribute('href')).toBe(
      'https://www.buymeacoffee.com/scottwindon',
    );
  });
});
