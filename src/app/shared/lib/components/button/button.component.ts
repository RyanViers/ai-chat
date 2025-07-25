import { Component, input, computed } from '@angular/core';
import { HcButtonDirective } from '../../primitives/button/button.directive';
import { cn } from '../../utils/cn';
import { ButtonVariant, Size } from '../../utils/types';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * TailwindUI Button Component
 * Based on TailwindUI button designs with full variant support
 */

// Button variant styles using class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
        secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100',
        soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200',
        outline: 'text-indigo-600 ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
        ghost: 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 active:bg-gray-200',
        link: 'text-indigo-600 underline-offset-4 hover:underline active:text-indigo-800',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-2.5 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-3.5 py-2.5 text-sm',
        xl: 'px-4 py-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'hc-button',
  imports: [HcButtonDirective],
  template: `
    <button 
      hcButton 
      [type]="type()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
      [class]="computedClasses()">
      
      @if (loading()) {
        <svg 
          class="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24">
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4">
          </circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      }
      
      <ng-content />
    </button>
  `,
})
export class HcButton {
  // Component inputs
  public readonly variant = input<ButtonVariant>('primary');
  public readonly size = input<Size>('md');
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly disabled = input<boolean>(false);
  public readonly loading = input<boolean>(false);
  public readonly class = input<string>('');

  // Computed classes using cva with proper class merging
  protected readonly computedClasses = computed(() => {
    return cn(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.class()
    );
  });

  protected handleClick(event: Event): void {
    // Prevent click when loading or disabled
    if (this.loading() || this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
