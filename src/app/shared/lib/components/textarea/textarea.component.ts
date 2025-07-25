import { Component, input, computed, forwardRef, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-xs min-h-[60px]',
        md: 'px-3 py-2 text-sm min-h-[80px]',
        lg: 'px-4 py-3 text-base min-h-[100px]'
      },
      state: {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
      resize: 'vertical'
    }
  }
);

type TextareaVariants = VariantProps<typeof textareaVariants>;

@Component({
  selector: 'hc-textarea',
  imports: [],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcTextarea),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <!-- Label -->
      @if (label()) {
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Textarea -->
      <textarea
        [class]="textareaClasses()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [rows]="effectiveRows()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        #textareaRef>
      </textarea>

      <!-- Character Count -->
      @if (maxLength()) {
        <div class="mt-1 text-xs text-gray-500 text-right">
          {{ value().length }} / {{ maxLength() }}
        </div>
      }

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
export class HcTextarea implements ControlValueAccessor {
  // Input properties
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly rows = input<number>(3);
  public readonly minRows = input<number>(2);
  public readonly maxRows = input<number>(10);
  public readonly maxLength = input<number | null>(null);
  public readonly autoResize = input<boolean>(false);
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly state = input<'default' | 'error' | 'success'>('default');
  public readonly resize = input<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');
  public readonly class = input<string>('');

  // Internal state
  protected readonly value = signal<string>('');

  // Control Value Accessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Auto-resize effect
    effect(() => {
      if (this.autoResize()) {
        // This would need access to the textarea element for proper auto-resize
        // For now, we'll use the rows calculation
      }
    });
  }

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('relative', this.class())
  );

  protected readonly textareaClasses = computed(() =>
    cn(
      textareaVariants({
        size: this.size(),
        state: this.errorMessage() ? 'error' : this.state(),
        resize: this.autoResize() ? 'none' : this.resize()
      })
    )
  );

  protected readonly effectiveRows = computed(() => {
    if (this.autoResize()) {
      const lines = this.value().split('\n').length;
      return Math.max(
        this.minRows(),
        Math.min(this.maxRows(), Math.max(lines, this.rows()))
      );
    }
    return this.rows();
  });

  // Methods
  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;

    // Check max length
    if (this.maxLength() && newValue.length > this.maxLength()!) {
      target.value = newValue.slice(0, this.maxLength()!);
      return;
    }

    this.value.set(newValue);
    this.onChange(newValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected onFocus(): void {
    // Handle focus if needed
  }

  // ControlValueAccessor implementation
  public writeValue(value: any): void {
    this.value.set(value || '');
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    // Note: For input signals, we can't directly set the value
    // The parent component should control the disabled state
  }
}
