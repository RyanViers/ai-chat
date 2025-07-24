import { Component, input, computed } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * TailwindUI Badge Component
 * Based on TailwindUI badge designs with full variant support
 */

// Badge variant styles using class-variance-authority
const badgeVariants = cva(
  // Base styles from TailwindUI
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 text-gray-600 ring-gray-500/10',
        primary: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
        success: 'bg-green-50 text-green-700 ring-green-600/20',
        warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        error: 'bg-red-50 text-red-700 ring-red-600/10',
        info: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-2.5 py-1.5 text-sm',
      },
      rounded: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'md',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Component({
  selector: 'hc-badge',
  standalone: true,
  template: `
    <span [class]="computedClasses()">
      <!-- Leading icon -->
      @if (leadingIcon()) {
        <span class="mr-1.5 h-1.5 w-1.5 rounded-full" [class]="dotClasses()"></span>
      }

      <!-- Badge content -->
      <ng-content></ng-content>

      <!-- Trailing icon/close button -->
      @if (removable()) {
        <button
          type="button"
          class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
          (click)="onRemove()"
        >
          <span class="sr-only">Remove</span>
          <svg class="h-3.5 w-3.5" viewBox="0 0 14 14">
            <path
              d="M4 4l6 6m0-6l-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      }
    </span>
  `,
})
export class HcBadge {
  // Component inputs
  variant = input<BadgeVariants['variant']>('default');
  size = input<BadgeVariants['size']>('md');
  rounded = input<BadgeVariants['rounded']>('md');
  leadingIcon = input<boolean>(false);
  removable = input<boolean>(false);
  class = input<string>('');

  // Computed classes for badge
  protected computedClasses = computed(() => {
    return cn(
      badgeVariants({
        variant: this.variant(),
        size: this.size(),
        rounded: this.rounded(),
      }),
      this.class()
    );
  });

  // Computed classes for status dot
  protected dotClasses = computed(() => {
    const variantMap = {
      default: 'bg-gray-400',
      primary: 'bg-indigo-400',
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400',
      info: 'bg-blue-400',
    };
    return variantMap[this.variant()];
  });

  // Event handler for remove button
  protected onRemove() {
    // Emit remove event or handle removal logic
    // This could be extended to emit a custom event
    console.log('Badge removed');
  }
}
