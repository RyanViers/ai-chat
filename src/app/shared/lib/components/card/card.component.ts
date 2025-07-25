import { Component, input, computed } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * TailwindUI Card Component
 * Based on TailwindUI card designs with full variant support
 */

// Card variant styles using class-variance-authority
const cardVariants = cva(
  // Base styles from TailwindUI
  'overflow-hidden bg-white shadow',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-lg',
        outline: 'shadow-none ring-1 ring-gray-200',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      rounded: 'lg',
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

@Component({
  selector: 'hc-card',
  host: {
    '[class]': 'computedClasses()'
  },
  template: `
    <div>
      <!-- Card header -->
      @if (hasHeader()) {
        <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
          <ng-content select="[slot=header]" />
        </div>
      }

      <!-- Card content -->
      <div [class]="contentClasses()">
        <ng-content />
      </div>

      <!-- Card footer -->
      @if (hasFooter()) {
        <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
          <ng-content select="[slot=footer]" />
        </div>
      }
    </div>
  `,
})
export class HcCard {
  // Component inputs
  variant = input<CardVariants['variant']>('default');
  rounded = input<CardVariants['rounded']>('lg');
  padding = input<CardVariants['padding']>('md');
  hasHeader = input<boolean>(false);
  hasFooter = input<boolean>(false);
  class = input<string>('');

  // Computed classes for card
  protected computedClasses = computed(() => {
    return cn(
      cardVariants({
        variant: this.variant(),
        rounded: this.rounded(),
        padding: this.hasHeader() || this.hasFooter() ? 'none' : this.padding(),
      }),
      this.class()
    );
  });

  // Computed classes for content area
  protected contentClasses = computed(() => {
    if (this.hasHeader() || this.hasFooter()) {
      // If card has header/footer, apply padding to content area
      const paddingMap = {
        none: '',
        sm: 'px-4 py-5 sm:p-4',
        md: 'px-4 py-5 sm:p-6',
        lg: 'px-4 py-5 sm:p-8',
      };
      return paddingMap[this.padding()];
    }
    return '';
  });
}
