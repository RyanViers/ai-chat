import { Component, input, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HcInputDirective } from '../../primitives/input/input.directive';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * TailwindUI Input Component
 * Based on TailwindUI input designs with full variant support
 */

// Input variant styles using class-variance-authority
const inputVariants = cva(
  // Base styles from TailwindUI
  'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
  {
    variants: {
      size: {
        sm: 'py-1 px-2 text-xs',
        md: 'py-1.5 px-3 text-sm',
        lg: 'py-2 px-3 text-base',
      },
      state: {
        default: '',
        error: 'ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500',
        success: 'ring-green-300 text-green-900 placeholder:text-green-300 focus:ring-green-500',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;

@Component({
  selector: 'hc-input',
  imports: [HcInputDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcInput),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <!-- Label -->
      @if (label()) {
        <label 
          [for]="inputId()" 
          class="block text-sm font-medium leading-6 text-gray-900 mb-2">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Input wrapper -->
      <div class="relative">
        <input
          hcInput
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class]="computedClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        <!-- Leading icon -->
        @if (leadingIcon()) {
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ng-content select="[slot=leading-icon]"></ng-content>
          </div>
        }

        <!-- Trailing icon -->
        @if (trailingIcon()) {
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ng-content select="[slot=trailing-icon]"></ng-content>
          </div>
        }
      </div>

      <!-- Help text -->
      @if (helpText()) {
        <p 
          [id]="helpTextId()" 
          class="mt-2 text-sm"
          [class.text-gray-600]="state() === 'default'"
          [class.text-red-600]="state() === 'error'"
          [class.text-green-600]="state() === 'success'">
          {{ helpText() }}
        </p>
      }

      <!-- Error message -->
      @if (errorMessage()) {
        <p 
          [id]="errorId()" 
          class="mt-2 text-sm text-red-600">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `,
})
export class HcInput implements ControlValueAccessor {
  // Component inputs
  public readonly label = input<string>('');
  public readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'>('text');
  public readonly placeholder = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly size = input<InputVariants['size']>('md');
  public readonly state = input<InputVariants['state']>('default');
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly leadingIcon = input<boolean>(false);
  public readonly trailingIcon = input<boolean>(false);
  public readonly class = input<string>('');

  // Internal state
  private readonly _value = signal<string>('');
  protected readonly value = this._value.asReadonly();

  // Generate unique IDs
  private readonly _id = Math.random().toString(36).substr(2, 9);
  protected readonly inputId = input<string>(`hc-input-${this._id}`);
  protected readonly helpTextId = computed(() => `${this.inputId()}-help`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);

  // Computed classes
  protected readonly computedClasses = computed(() => {
    return cn(
      inputVariants({
        size: this.size(),
        state: this.errorMessage() ? 'error' : this.state(),
      }),
      // Adjust padding for icons
      this.leadingIcon() && 'pl-10',
      this.trailingIcon() && 'pr-10',
      this.class()
    );
  });

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  public writeValue(value: string): void {
    this._value.set(value || '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    // Handled by disabled input
  }

  // Event handlers
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._value.set(target.value);
    this.onChange(target.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected onFocus(): void {
    // Focus handling if needed
  }
}
