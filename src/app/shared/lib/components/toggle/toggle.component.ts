import { Component, computed, input, output, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { HcToggleDirective } from '../../primitives/toggle/toggle.directive';

const toggleVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11'
      },
      variant: {
        default: 'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200',
        success: 'data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200',
        warning: 'data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-gray-200',
        error: 'data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-200'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
);

const toggleThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0',
        md: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

type ToggleVariants = VariantProps<typeof toggleVariants>;

@Component({
  selector: 'hc-toggle',
  imports: [HcToggleDirective],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcToggle),
      multi: true
    }
  ],
  template: `
    <div class="flex items-center space-x-2">
      <!-- Hidden input for form submission -->
      <input
        type="checkbox"
        class="sr-only"
        [checked]="checked()"
        [disabled]="disabled()"
        [id]="inputId"
        (change)="onToggle()"
        #hiddenInput>

      <!-- Toggle Switch -->
      <button
        hcToggle
        [class]="toggleClasses()"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        [disabled]="disabled()"
        (pressedChange)="onToggle()">
        
        <span
          [class]="thumbClasses()"
          [attr.data-state]="checked() ? 'checked' : 'unchecked'">
        </span>
      </button>

      <!-- Label -->
      @if (label()) {
        <label 
          [for]="inputId"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          [class.text-gray-900]="!disabled()"
          [class.text-gray-500]="disabled()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }
    </div>

    <!-- Help Text -->
    @if (helpText() && !errorMessage()) {
      <p class="mt-1 text-xs text-gray-500">{{ helpText() }}</p>
    }

    <!-- Error Message -->
    @if (errorMessage()) {
      <p class="mt-1 text-xs text-red-600">{{ errorMessage() }}</p>
    }
  `,
})
export class HcToggle implements ControlValueAccessor {
  // Input properties
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly size = input<ToggleVariants['size']>('md');
  public readonly variant = input<ToggleVariants['variant']>('default');
  public readonly class = input<string>('');

  // Output events
  public readonly valueChange = output<boolean>();

  // Internal state
  public readonly checked = signal<boolean>(false);
  public readonly inputId = `hc-toggle-${Math.random().toString(36).substr(2, 9)}`;

  // Control Value Accessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('flex flex-col', this.class())
  );

  protected readonly toggleClasses = computed(() =>
    cn(
      toggleVariants({
        size: this.size(),
        variant: this.variant()
      })
    )
  );

  protected readonly thumbClasses = computed(() =>
    cn(
      toggleThumbVariants({
        size: this.size()
      })
    )
  );

  // Methods
  protected onToggle(): void {
    if (this.disabled()) return;
    
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.onTouched();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onToggle();
    }
  }

  // ControlValueAccessor implementation
  public writeValue(value: boolean): void {
    this.checked.set(!!value);
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
