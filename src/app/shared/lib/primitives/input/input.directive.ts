import { Directive, input, signal, computed, ElementRef, inject } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Input Primitive
 * Provides accessible input behavior without styling
 * Similar to Radix UI primitives
 */
@Directive({
  selector: '[hcInput]',
  exportAs: 'hcInput',
  host: {
    '[attr.type]': 'type()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '[attr.placeholder]': 'placeholder()',
    '[attr.aria-invalid]': 'invalid()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[class]': 'computedClasses()',
    '(focus)': 'handleFocus($event)',
    '(blur)': 'handleBlur($event)',
    '(input)': 'handleInput($event)',
  },
})
export class HcInputDirective {
  private elementRef = inject(ElementRef<HTMLInputElement>);

  // Input signals
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'>('text');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  invalid = input<boolean>(false);
  placeholder = input<string>('');
  ariaDescribedBy = input<string>('');
  class = input<string>('');

  // Internal state
  private _isFocused = signal(false);
  private _hasValue = signal(false);

  // Public state for consumers
  isFocused = this._isFocused.asReadonly();
  hasValue = this._hasValue.asReadonly();

  // Computed classes
  protected computedClasses = computed(() => {
    return cn(
      // Base input styles
      'block w-full rounded-md border-0 py-1.5 px-3',
      'text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
      'placeholder:text-gray-400',
      'focus:ring-2 focus:ring-inset focus:ring-indigo-600',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      'disabled:ring-gray-200',
      // Invalid state
      this.invalid() && 'ring-red-300 focus:ring-red-600',
      // User classes
      this.class()
    );
  });

  protected handleFocus(event: FocusEvent) {
    this._isFocused.set(true);
  }

  protected handleBlur(event: FocusEvent) {
    this._isFocused.set(false);
  }

  protected handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this._hasValue.set(target.value.length > 0);
  }

  // Method to focus the input programmatically
  focus() {
    this.elementRef.nativeElement.focus();
  }

  // Method to get the current value
  getValue(): string {
    return this.elementRef.nativeElement.value;
  }
}
