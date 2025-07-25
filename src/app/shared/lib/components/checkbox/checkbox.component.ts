import { Component, computed, input, output, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { HcCheckboxDirective } from '../../primitives/checkbox/checkbox.directive';

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
      },
      variant: {
        default: 'border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600',
        success: 'border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:text-white data-[state=checked]:border-green-600',
        warning: 'border-gray-300 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white data-[state=checked]:border-yellow-600',
        error: 'border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:text-white data-[state=checked]:border-red-600'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
);

type CheckboxVariants = VariantProps<typeof checkboxVariants>;

@Component({
  selector: 'hc-checkbox',
  imports: [HcCheckboxDirective],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcCheckbox),
      multi: true
    }
  ],
  template: `
    <div class="flex items-center space-x-2">
      <!-- Checkbox Input -->
      <input
        hcCheckbox
        [class]="checkboxClasses()"
        [checked]="checked()"
        [disabled]="disabled()"
        [id]="inputId"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        (checkedChange)="onToggle()"
        (blur)="handleBlur()"
        #checkboxInput>

      <!-- Check Icon -->
      @if (checked()) {
        <svg 
          class="absolute pointer-events-none fill-current w-3 h-3 text-white"
          [class.w-2]="size() === 'sm'"
          [class.h-2]="size() === 'sm'"
          [class.w-4]="size() === 'lg'"
          [class.h-4]="size() === 'lg'"
          style="margin-left: 1px; margin-top: 1px;"
          viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      }

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
export class HcCheckbox implements ControlValueAccessor {
  // Input properties
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly size = input<CheckboxVariants['size']>('md');
  public readonly variant = input<CheckboxVariants['variant']>('default');
  public readonly class = input<string>('');

  // Output events
  public readonly valueChange = output<boolean>();

  // Internal state
  public readonly checked = signal<boolean>(false);
  public readonly inputId = `hc-checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Control Value Accessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('flex flex-col relative', this.class())
  );

  protected readonly checkboxClasses = computed(() =>
    cn(
      checkboxVariants({
        size: this.size(),
        variant: this.variant()
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
  }

  protected handleBlur(): void {
    this.onTouched();
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
