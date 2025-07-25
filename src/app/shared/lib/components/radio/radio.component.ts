import { Component, computed, input, output, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { HcRadioDirective } from '../../primitives/radio/radio.directive';

const radioVariants = cva(
  'sr-only',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: ''
      },
      variant: {
        default: '',
        success: '',
        warning: '',
        error: ''
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
);

const radioIndicatorVariants = cva(
  'flex items-center justify-center rounded-full border-2 cursor-pointer transition-colors',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
      },
      variant: {
        default: 'border-gray-300 hover:border-blue-400',
        success: 'border-gray-300 hover:border-green-400',
        warning: 'border-gray-300 hover:border-yellow-400',
        error: 'border-gray-300 hover:border-red-400'
      },
      checked: {
        true: '',
        false: 'bg-white'
      }
    },
    compoundVariants: [
      {
        variant: 'default',
        checked: true,
        class: 'bg-blue-600 border-blue-600'
      },
      {
        variant: 'success',
        checked: true,
        class: 'bg-green-600 border-green-600'
      },
      {
        variant: 'warning',
        checked: true,
        class: 'bg-yellow-600 border-yellow-600'
      },
      {
        variant: 'error',
        checked: true,
        class: 'bg-red-600 border-red-600'
      }
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      checked: false
    }
  }
);

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type RadioVariants = VariantProps<typeof radioVariants>;
type RadioIndicatorVariants = VariantProps<typeof radioIndicatorVariants>;

@Component({
  selector: 'hc-radio-group',
  imports: [HcRadioDirective],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcRadioGroup),
      multi: true
    }
  ],
  template: `
    <div class="space-y-2">
      <!-- Group Label -->
      @if (label()) {
        <label class="text-sm font-medium text-gray-700">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Radio Options -->
      <div [class]="optionsLayoutClass()">
        @for (option of options(); track option.value) {
          <div class="flex items-center space-x-2">
            <!-- Hidden Radio Input -->
            <input
              hcRadio
              [class]="radioClasses()"
              [value]="option.value"
              [checked]="isSelected(option.value)"
              [disabled]="disabled() || option.disabled"
              [name]="groupName"
              [id]="getOptionId(option.value)"
              (checkedChange)="onSelectionChange(option.value)"
              (blur)="handleBlur()">

            <!-- Custom Radio Indicator -->
            <div 
              [class]="radioIndicatorClasses(option.value)"
              (click)="onSelectionChange(option.value)">
              @if (isSelected(option.value)) {
                <div 
                  class="rounded-full bg-white"
                  [class.w-1]="size() === 'sm'"
                  [class.h-1]="size() === 'sm'"
                  [class.w-1.5]="size() === 'md'"
                  [class.h-1.5]="size() === 'md'"
                  [class.w-2]="size() === 'lg'"
                  [class.h-2]="size() === 'lg'">
                </div>
              }
            </div>

            <!-- Option Label -->
            <label 
              [for]="getOptionId(option.value)"
              class="text-sm font-medium leading-none cursor-pointer"
              [class.text-gray-900]="!disabled() && !option.disabled"
              [class.text-gray-500]="disabled() || option.disabled"
              [class.cursor-not-allowed]="disabled() || option.disabled">
              {{ option.label }}
            </label>
          </div>
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
    </div>
  `,
})
export class HcRadioGroup implements ControlValueAccessor {
  // Input properties
  public readonly options = input<RadioOption[]>([]);
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  public readonly size = input<RadioVariants['size']>('md');
  public readonly variant = input<RadioVariants['variant']>('default');
  public readonly class = input<string>('');

  // Output events
  public readonly valueChange = output<string>();

  // Internal state
  protected readonly selectedValue = signal<string>('');
  protected readonly groupName = `hc-radio-group-${Math.random().toString(36).substr(2, 9)}`;

  // Control Value Accessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('flex flex-col', this.class())
  );

  protected readonly radioClasses = computed(() =>
    cn(
      radioVariants({
        size: this.size(),
        variant: this.variant()
      })
    )
  );

  protected readonly optionsLayoutClass = computed(() => 
    this.orientation() === 'horizontal' 
      ? 'flex flex-wrap gap-4' 
      : 'space-y-2'
  );

  // Methods
  protected radioIndicatorClasses(value: string): string {
    return cn(
      radioIndicatorVariants({
        size: this.size(),
        variant: this.variant(),
        checked: this.isSelected(value)
      })
    );
  }

  protected isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }

  protected getOptionId(value: string): string {
    return `${this.groupName}-${value}`;
  }

  protected onSelectionChange(value: string): void {
    if (this.disabled()) return;
    
    this.selectedValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  public writeValue(value: string): void {
    this.selectedValue.set(value || '');
  }

  public registerOnChange(fn: (value: string) => void): void {
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
