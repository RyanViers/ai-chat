import { Directive, input, signal, computed } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Base Button Primitive
 * Provides accessible button behavior without styling
 * Similar to Radix UI primitives
 */
@Directive({
  selector: '[hcBaseButton]',
  standalone: true,
  exportAs: 'hcBaseButton',
  host: {
    '[attr.type]': 'type()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-pressed]': 'pressed()',
    '[class]': 'computedClasses()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class HcBaseButtonDirective {
  // Input signals
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  pressed = input<boolean | undefined>(undefined);
  loading = input<boolean>(false);
  class = input<string>('');

  // Internal state
  private _isFocused = signal(false);
  private _isPressed = signal(false);

  // Computed classes
  protected computedClasses = computed(() => {
    return cn(
      // Base button styles
      'inline-flex items-center justify-center',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'transition-colors duration-200',
      // User classes
      this.class()
    );
  });

  protected handleClick(event: Event) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  protected handleKeydown(event: KeyboardEvent) {
    if (this.disabled() || this.loading()) {
      return;
    }

    // Handle space and enter keys
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._isPressed.set(true);
      
      // Reset pressed state after a short delay
      setTimeout(() => this._isPressed.set(false), 150);
    }
  }
}
