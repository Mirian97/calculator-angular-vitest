# Angular Zoneless Calculator with Vitest

A simple, zoneless Angular calculator application built with Angular 18+ and tested using [Vitest](https://vitest.dev/). This project demonstrates a basic calculator with number input, operations (+, -, \*, /), decimal handling, and keyboard support. The focus here is on **testing with Vitest in an Angular environment**, showcasing how to integrate Vitest's lightweight, fast testing tools with Angular's `TestBed` for unit and component testing.

## 🚀 Quick Start

1. Clone the repo:

   ```bash
   git clone https://github.com/Mirian97/calculator-angular-vitest.git
   cd calculator-angular-vitest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:4200](http://localhost:4200) to view the calculator.

4. Run tests (covered in detail below):
   ```bash
   npm run test
   # Or with coverage
   npm run test:coverage
   ```

## 🧪 Testing with Vitest & Angular

This project uses **Vitest** as the test runner, leveraging its Vite-powered speed and Jest-like API (via `vi` for mocks and spies). Vitest integrates seamlessly with Angular's testing ecosystem (`@angular/core/testing`), allowing you to test components, services, and more without Zone.js (thanks to zoneless change detection in Angular 18+).

### Why Vitest for Angular?

- **Speed**: In-memory execution with Vite's hot module replacement (HMR) makes tests run ~10x faster than Jest.
- **Familiar API**: Uses `vi` (Vitest's mock library) for spies, fakes, and timers—similar to Jest but more lightweight.
- **Angular Compatibility**: Works with `TestBed` for dependency injection and component rendering.
- **Zoneless Friendly**: No Zone.js overhead; tests run synchronously where possible.

Vitest config is in `vite.config.ts` (extended for testing). Tests are in `*.spec.ts` files and use `describe`/`it`/`expect` from Vitest.

### Key Vitest Concepts in Angular Tests

#### 1. **Basic Setup with TestBed**

Angular's `TestBed` bootstraps components/services for testing. Vitest wraps this in `beforeEach` for isolation.

**Example: Testing `AppComponent`** (from `app.component.spec.ts`):

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it("should create the app", () => {
    expect(app).toBeTruthy(); // Vitest's expect
  });

  it(`should have the 'zoneless-calculator' title`, () => {
    expect(app.title).toEqual("zoneless-calculator");
  });

  it("should render router-outlet", () => {
    const routerOutlet = compiled.querySelector("router-outlet");
    expect(routerOutlet).toBeTruthy();
  });
});
```

- **Concept**: `TestBed.configureTestingModule` sets up the Angular injector. `compileComponents` async-compiles templates. Vitest's `expect` asserts DOM queries and properties.
- **Zoneless Note**: No `fakeAsync` or `tick` needed—signals and computed values update reactively.

#### 2. **Mocking with `vi` (Vitest's vi Module)**

`vi` provides Jest-compatible mocks. Use `vi.spyOn` for spying on methods/outputs.

**Example: Testing `CalculatorButtonComponent`** (from `calculator-button.component.spec.ts`):

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CalculatorButtonComponent } from "./calculator-button.component";

describe("CalculatorButtonComponent", () => {
  let component: CalculatorButtonComponent;
  let fixture: ComponentFixture<CalculatorButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorButtonComponent],
    });
    fixture = TestBed.createComponent(CalculatorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.resetAllMocks(); // Reset mocks between tests
  });

  it("should emit onClick when handleClick is called", () => {
    const spyClick = vi.spyOn(component.onClick, "emit"); // Spy on Angular output
    const buttonElement = fixture.nativeElement.querySelector("button");
    buttonElement!.innerHTML = " 9 ";
    buttonElement!.click();

    expect(spyClick).toHaveBeenCalled(); // Assert spy
    expect(spyClick).toHaveBeenCalledWith("9");
  });
});
```

- **Concept**: `vi.spyOn` tracks calls on Angular outputs (`onClick.emit`). `vi.resetAllMocks()` cleans up state. Great for testing event emissions without real side effects.

#### 3. **Fake Timers with `vi.useFakeTimers()`**

Simulate time-based logic (e.g., timeouts) without waiting.

**Example: Button press animation**:

```typescript
it("should set isPressed to true and then false when KeyboardPressedStyle", () => {
  vi.useFakeTimers(); // Enable fake timers
  fixture.nativeElement.querySelector("button")!.textContent = "4";
  component.keyboardPressedStyle("4");

  expect(component.isPressed()).toBeTruthy();
  vi.advanceTimersByTime(100); // Jump time forward
  expect(component.isPressed()).toBeFalsy();
});

afterEach(() => {
  vi.useRealTimers(); // Restore real timers
});
```

- **Concept**: `vi.useFakeTimers()` mocks `setTimeout`. `vi.advanceTimersByTime(ms)` advances time instantly. Ideal for zoneless apps where async ops are signal-driven.

#### 4. **Testing Services (Pure Logic)**

Services are easy to test standalone—no `TestBed` needed for simple cases.

**Example: `CalculatorService`** (from `calculator.service.spec.ts`):

```typescript
import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";

describe("CalculatorService", () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
    vi.resetAllMocks();
  });

  it("should calculate result for addition", () => {
    service.constructNumber("1");
    service.constructNumber("+");
    service.constructNumber("8");
    service.constructNumber("=");
    expect(service.resultText()).toBe("9");
  });

  it("should handle max length", () => {
    const consoleSpy = vi.spyOn(console, "log"); // Mock console.log
    consoleSpy.mockImplementation(() => {}); // No-op implementation

    for (let i = 0; i < 20; i++) {
      service.constructNumber("8");
    }

    expect(service.resultText().length).toBe(10);
    expect(consoleSpy).toHaveBeenCalledTimes(10); // Assert mock calls
  });
});
```

- **Concept**: Inject services with `TestBed.inject`. `vi.spyOn(console, 'log')` mocks side effects. Test signals directly with `expect(service.resultText()).toBe(...)`.

#### 5. **Component Integration Tests**

Test child components with overrides.

**Example: `CalculatorViewComponent`** (from `calculator-view.component.spec.ts`):

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [CalculatorViewComponent],
  }).overrideComponent(CalculatorViewComponent, {
    // Mock child
    set: { imports: [MockCalculatorComponent] },
  });

  fixture = TestBed.createComponent(CalculatorViewComponent);
  // ...
});
```

- **Concept**: `overrideComponent` swaps real children with mocks for isolation. Query DOM with `fixture.nativeElement.querySelector`.

### Running & Coverage

- **All Tests**: `npm run test` (runs Vitest with `--watch=false`).
- **Watch Mode**: `npm run test:watch` (reruns on file changes).
- **Coverage**: `npm run test:coverage` (generates HTML report in `coverage/`).
- **CI**: GitHub Actions workflow tests on push/PR.

Vitest config highlights:

```typescript
// vite.config.ts (test section)
export default defineConfig({
  test: {
    globals: true, // No need to import describe/it/expect
    environment: "jsdom", // For DOM queries
    setupFiles: ["./src/test-setup.ts"], // Angular TestBed setup
  },
});
```

## 📚 Best Practices & Tips

- **Isolation**: Use `vi.resetAllMocks()` in `beforeEach` to avoid test pollution.
- **Zoneless Testing**: Rely on signals for reactivity—avoid `async` unless compiling templates.
- **DOM Assertions**: Use `fixture.detectChanges()` after inputs; query with `fixture.nativeElement`.
- **Mocking External**: For HTTP/observables, use `vi.fn()` or Angular's `HttpClientTestingModule`.
- **Debugging**: Run `npm run test -- --reporter=verbose` for detailed output.
- **Resources**:
  - [Vitest Docs](https://vitest.dev/guide/)
  - [Angular Testing Guide](https://angular.dev/guide/testing)
  - [Zoneless Angular](https://angular.dev/guide/signals#zoneless-change-detection)

## 🤝 Contributing

- Add tests for new features!
- Run `npm run lint && npm run test` before PRs.

Built with ❤️ for learning Vitest + Angular. Contributions welcome!
