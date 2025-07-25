import {
  Directive,
  ElementRef,
  input,
  output,
  inject,
  signal,
  effect,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[hcSelect]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcSelectDirective),
      multi: true,
    },
  ],
  host: {
    role: 'combobox',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"listbox"',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-invalid]': 'invalid()',
    '[attr.aria-required]': 'required()',
    '[attr.aria-disabled]': 'disabled()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeyDown($event)',
    '(blur)': 'onBlur()',
  },
})
export class HcSelectDirective implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // Signals for state management
  public readonly isOpen = signal(false);
  public readonly selectedValue = signal<any>(null);
  public readonly focusedIndex = signal(-1);
  public readonly isDisabled = signal(false);

  // Configuration inputs
  public placeholder = input('');
  public disabled = input(false);
  public required = input(false);
  public invalid = input(false);
  public labelledBy = input('');
  public describedBy = input('');
  public options = input<any[]>([]);
  public valueKey = input('value');
  public labelKey = input('label');

  // Events
  public valueChange = output<any>();
  public openChange = output<boolean>();
  public focusChange = output<number>();

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Update disabled state when input changes
    effect(() => {
      this.isDisabled.set(this.disabled());
    });

    // Emit events when state changes
    effect(() => {
      this.valueChange.emit(this.selectedValue());
    });

    effect(() => {
      this.openChange.emit(this.isOpen());
    });

    effect(() => {
      this.focusChange.emit(this.focusedIndex());
    });
  }

  public onClick(event: Event): void {
    if (this.disabled()) return;
    
    event.preventDefault();
    this.toggle();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen()) {
          this.selectOption(this.focusedIndex());
        } else {
          this.open();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveFocus(1);
        } else {
          this.open();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveFocus(-1);
        } else {
          this.open();
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(this.options().length - 1);
        }
        break;

      case 'Tab':
        this.close();
        break;
    }
  }

  public onBlur(): void {
    this.onTouched();
    // Close dropdown when focus leaves the component
    setTimeout(() => {
      this.close();
    }, 100);
  }

  // Public methods
  public open(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
    this.focusedIndex.set(this.getCurrentSelectedIndex());
  }

  public close(): void {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  public toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  public selectOption(index: number): void {
    if (index < 0 || index >= this.options().length) return;
    
    const option = this.options()[index];
    const value = this.valueKey() ? option[this.valueKey()] : option;
    
    this.selectedValue.set(value);
    this.onChange(value);
    this.close();
    
    // Return focus to the select element
    this.elementRef.nativeElement.focus();
  }

  private moveFocus(direction: number): void {
    const currentIndex = this.focusedIndex();
    const newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.options().length) {
      this.focusedIndex.set(newIndex);
    }
  }

  private getCurrentSelectedIndex(): number {
    const currentValue = this.selectedValue();
    return this.options().findIndex(option => {
      const optionValue = this.valueKey() ? option[this.valueKey()] : option;
      return optionValue === currentValue;
    });
  }

  // ControlValueAccessor implementation
  public writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Helper methods for templates
  public getDisplayValue(): string {
    const value = this.selectedValue();
    if (!value) return this.placeholder();
    
    const option = this.options().find(opt => {
      const optionValue = this.valueKey() ? opt[this.valueKey()] : opt;
      return optionValue === value;
    });
    
    return option ? (this.labelKey() ? option[this.labelKey()] : option) : this.placeholder();
  }

  public getOptionLabel(option: any): string {
    return this.labelKey() ? option[this.labelKey()] : option;
  }

  public getOptionValue(option: any): any {
    return this.valueKey() ? option[this.valueKey()] : option;
  }

  public isOptionSelected(option: any): boolean {
    const optionValue = this.getOptionValue(option);
    return optionValue === this.selectedValue();
  }

  public isOptionFocused(index: number): boolean {
    return index === this.focusedIndex();
  }
}
