import { Directive, input, signal, computed, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

/**
 * Toggle Primitive
 * Provides accessible toggle/switch behavior without styling
 * Similar to Radix UI primitives
 */
@Directive({
  selector: '[hcToggle]',
  exportAs: 'hcToggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HcToggleDirective,
      multi: true
    }
  ],
  host: {
    '[attr.role]': '"switch"',
    '[attr.disabled]': 'disabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '[attr.aria-checked]': 'pressed()',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[class]': 'computedClasses()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    '(focus)': 'handleFocus($event)',
    '(blur)': 'handleBlur($event)',
  },
})
export class HcToggleDirective implements ControlValueAccessor {
  // Input signals
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly ariaDescribedBy = input<string>('');
  public readonly class = input<string>('');

  // Output events
  public readonly pressedChange = output<boolean>();

  // Internal state
  private readonly _pressed = signal<boolean>(false);
  private readonly _isFocused = signal<boolean>(false);

  // Public state for consumers
  public readonly pressed = this._pressed.asReadonly();
  public readonly isFocused = this._isFocused.asReadonly();

  // Control Value Accessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // Computed classes
  protected readonly computedClasses = computed(() => {
    return cn(
      // Base toggle styles for accessibility
      'relative cursor-pointer',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-colors duration-200',
      // User classes
      this.class()
    );
  });

  protected handleClick(event: Event) {
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      return;
    }

    this.toggle();
  }

  protected handleKeydown(event: KeyboardEvent) {
    if (this.disabled() || this.readonly()) {
      return;
    }

    // Toggle on Space or Enter
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  protected handleFocus(event: FocusEvent) {
    this._isFocused.set(true);
  }

  protected handleBlur(event: FocusEvent) {
    this._isFocused.set(false);
    this.onTouched();
  }

  private toggle() {
    const newPressed = !this._pressed();
    this._pressed.set(newPressed);
    this.onChange(newPressed);
    this.pressedChange.emit(newPressed);
  }

  // ControlValueAccessor implementation
  public writeValue(value: boolean): void {
    this._pressed.set(!!value);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    // Note: For input signals, we can't directly set the value
    // The parent component should control the disabled state
  }
}
