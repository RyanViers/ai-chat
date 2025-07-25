import { Directive, input, signal, computed, output, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

/**
 * Slider Primitive
 * Provides accessible slider behavior without styling
 * Similar to Radix UI primitives
 */
@Directive({
  selector: '[hcSlider]',
  exportAs: 'hcSlider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HcSliderDirective,
      multi: true
    }
  ],
  host: {
    '[attr.role]': '"slider"',
    '[attr.disabled]': 'disabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[class]': 'computedClasses()',
    '(mousedown)': 'handleMouseDown($event)',
    '(touchstart)': 'handleTouchStart($event)',
    '(keydown)': 'handleKeydown($event)',
    '(focus)': 'handleFocus($event)',
    '(blur)': 'handleBlur($event)',
  },
})
export class HcSliderDirective implements ControlValueAccessor {
  private elementRef = inject(ElementRef<HTMLElement>);

  // Input signals
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly min = input<number>(0);
  public readonly max = input<number>(100);
  public readonly step = input<number>(1);
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  public readonly ariaDescribedBy = input<string>('');
  public readonly class = input<string>('');

  // Output events
  public readonly valueChange = output<number>();

  // Internal state
  private readonly _value = signal<number>(0);
  private readonly _isFocused = signal<boolean>(false);
  private readonly _isDragging = signal<boolean>(false);

  // Public state for consumers
  public readonly value = this._value.asReadonly();
  public readonly isFocused = this._isFocused.asReadonly();
  public readonly isDragging = this._isDragging.asReadonly();

  // Control Value Accessor
  private onChange = (value: number) => {};
  private onTouched = () => {};

  // Computed classes
  protected readonly computedClasses = computed(() => {
    return cn(
      // Base slider styles for accessibility
      'relative cursor-pointer',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-colors duration-200',
      // User classes
      this.class()
    );
  });

  // Computed percentage for positioning
  public readonly percentage = computed(() => {
    const range = this.max() - this.min();
    return ((this.value() - this.min()) / range) * 100;
  });

  protected handleMouseDown(event: MouseEvent) {
    if (this.disabled() || this.readonly()) {
      return;
    }

    event.preventDefault();
    this._isDragging.set(true);
    this.updateValueFromEvent(event);
    this.addGlobalListeners();
  }

  protected handleTouchStart(event: TouchEvent) {
    if (this.disabled() || this.readonly()) {
      return;
    }

    event.preventDefault();
    this._isDragging.set(true);
    this.updateValueFromTouch(event);
    this.addGlobalTouchListeners();
  }

  protected handleKeydown(event: KeyboardEvent) {
    if (this.disabled() || this.readonly()) {
      return;
    }

    let newValue = this.value();
    const step = this.step();

    switch (event.code) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(this.min(), this.value() - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(this.max(), this.value() + step);
        break;
      case 'Home':
        event.preventDefault();
        newValue = this.min();
        break;
      case 'End':
        event.preventDefault();
        newValue = this.max();
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = Math.max(this.min(), this.value() - step * 10);
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = Math.min(this.max(), this.value() + step * 10);
        break;
    }

    if (newValue !== this.value()) {
      this.updateValue(newValue);
    }
  }

  protected handleFocus(event: FocusEvent) {
    this._isFocused.set(true);
  }

  protected handleBlur(event: FocusEvent) {
    this._isFocused.set(false);
    this.onTouched();
  }

  private updateValueFromEvent(event: MouseEvent) {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const percentage = this.orientation() === 'horizontal'
      ? (event.clientX - rect.left) / rect.width
      : 1 - (event.clientY - rect.top) / rect.height;
    
    this.updateValueFromPercentage(Math.max(0, Math.min(1, percentage)));
  }

  private updateValueFromTouch(event: TouchEvent) {
    if (event.touches.length === 0) return;
    
    const touch = event.touches[0];
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const percentage = this.orientation() === 'horizontal'
      ? (touch.clientX - rect.left) / rect.width
      : 1 - (touch.clientY - rect.top) / rect.height;
    
    this.updateValueFromPercentage(Math.max(0, Math.min(1, percentage)));
  }

  private updateValueFromPercentage(percentage: number) {
    const range = this.max() - this.min();
    const rawValue = this.min() + (percentage * range);
    const steppedValue = Math.round(rawValue / this.step()) * this.step();
    const clampedValue = Math.max(this.min(), Math.min(this.max(), steppedValue));
    
    this.updateValue(clampedValue);
  }

  private updateValue(value: number) {
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private addGlobalListeners() {
    const handleMouseMove = (e: MouseEvent) => this.updateValueFromEvent(e);
    const handleMouseUp = () => {
      this._isDragging.set(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private addGlobalTouchListeners() {
    const handleTouchMove = (e: TouchEvent) => this.updateValueFromTouch(e);
    const handleTouchEnd = () => {
      this._isDragging.set(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }

  // ControlValueAccessor implementation
  public writeValue(value: number): void {
    this._value.set(value ?? 0);
  }

  public registerOnChange(fn: (value: number) => void): void {
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
