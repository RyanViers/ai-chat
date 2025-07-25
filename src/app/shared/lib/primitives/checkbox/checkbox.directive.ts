import { Directive, input, signal, computed, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

/**
 * Checkbox Primitive
 * Provides accessible checkbox behavior without styling
 * Similar to Radix UI primitives
 */
@Directive({
  selector: '[hcCheckbox]',
  exportAs: 'hcCheckbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HcCheckboxDirective,
      multi: true
    }
  ],
  host: {
    '[attr.type]': '"checkbox"',
    '[attr.disabled]': 'disabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '[attr.checked]': 'checked()',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[class]': 'computedClasses()',
    '(change)': 'handleChange($event)',
    '(focus)': 'handleFocus($event)',
    '(blur)': 'handleBlur($event)',
  },
})
export class HcCheckboxDirective implements ControlValueAccessor {
  // Input signals
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly indeterminate = input<boolean>(false);
  public readonly ariaDescribedBy = input<string>('');
  public readonly class = input<string>('');

  // Output events
  public readonly checkedChange = output<boolean>();

  // Internal state
  private readonly _checked = signal<boolean>(false);
  private readonly _isFocused = signal<boolean>(false);

  // Public state for consumers
  public readonly checked = this._checked.asReadonly();
  public readonly isFocused = this._isFocused.asReadonly();

  // Control Value Accessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // Computed classes
  protected readonly computedClasses = computed(() => {
    return cn(
      // Base checkbox styles for accessibility
      'relative cursor-pointer',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-colors duration-200',
      // User classes
      this.class()
    );
  });

  protected handleChange(event: Event) {
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      return;
    }

    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    
    this._checked.set(checked);
    this.onChange(checked);
    this.checkedChange.emit(checked);
  }

  protected handleFocus(event: FocusEvent) {
    this._isFocused.set(true);
  }

  protected handleBlur(event: FocusEvent) {
    this._isFocused.set(false);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  public writeValue(value: boolean): void {
    this._checked.set(!!value);
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
