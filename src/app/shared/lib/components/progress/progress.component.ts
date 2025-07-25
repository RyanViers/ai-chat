import { Component, input, computed } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const progressVariants = cva(
  'w-full bg-gray-200 rounded-full overflow-hidden',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

const progressBarVariants = cva(
  'h-full transition-all duration-300 ease-in-out rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        error: 'bg-red-600'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

type ProgressVariants = VariantProps<typeof progressVariants>;
type ProgressBarVariants = VariantProps<typeof progressBarVariants>;

@Component({
  selector: 'hc-progress',
  imports: [],
  host: {
    '[class]': 'computedClasses()'
  },
  template: `
    <div class="relative">
      <!-- Label (if provided) -->
      @if (label()) {
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>{{ label() }}</span>
          @if (!indeterminate()) {
            <span>{{ value() }}%</span>
          }
        </div>
      }

      <!-- Progress Container -->
      <div [class]="progressClasses()">
        @if (indeterminate()) {
          <!-- Indeterminate Progress -->
          <div [class]="progressBarClasses()" 
               class="w-1/3 animate-pulse absolute left-0 top-0">
          </div>
        } @else {
          <!-- Determinate Progress -->
          <div [class]="progressBarClasses()" 
               [style.width.%]="clampedValue()">
          </div>
        }
      </div>

      <!-- Help Text -->
      @if (helpText()) {
        <p class="mt-1 text-xs text-gray-500">{{ helpText() }}</p>
      }
    </div>
  `,
})
export class HcProgress {
  // Input properties
  public readonly value = input<number>(0);
  public readonly max = input<number>(100);
  public readonly min = input<number>(0);
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly indeterminate = input<boolean>(false);
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly variant = input<'default' | 'success' | 'warning' | 'error'>('default');
  public readonly class = input<string>('');

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('w-full', this.class())
  );

  protected readonly progressClasses = computed(() =>
    cn(
      progressVariants({
        size: this.size()
      })
    )
  );

  protected readonly progressBarClasses = computed(() =>
    cn(
      progressBarVariants({
        variant: this.variant()
      })
    )
  );

  protected readonly clampedValue = computed(() => {
    const val = this.value();
    const minVal = this.min();
    const maxVal = this.max();
    return Math.min(maxVal, Math.max(minVal, val));
  });
}
