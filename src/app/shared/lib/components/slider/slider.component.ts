import { Component, input, computed, forwardRef, signal, output, effect, ElementRef, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const sliderVariants = cva(
  'relative flex w-full touch-none select-none items-center cursor-pointer',
  {
    variants: {
      size: {
        sm: 'h-4',
        md: 'h-5',
        lg: 'h-6'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

const sliderTrackVariants = cva(
  'relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-200',
        success: 'bg-green-100',
        warning: 'bg-yellow-100',
        error: 'bg-red-100'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const sliderRangeVariants = cva(
  'absolute h-full rounded-full',
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

const sliderThumbVariants = cva(
  'absolute block h-4 w-4 rounded-full border-2 border-white bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-blue-500',
        success: 'focus-visible:ring-green-500',
        warning: 'focus-visible:ring-yellow-500',
        error: 'focus-visible:ring-red-500'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

type SliderVariants = VariantProps<typeof sliderVariants>;

@Component({
  selector: 'hc-slider',
  imports: [],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcSlider),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <!-- Label -->
      @if (label()) {
        <div class="flex justify-between text-sm text-gray-700 mb-2">
          <label class="font-medium">
            {{ label() }}
            @if (required()) {
              <span class="text-red-500 ml-1">*</span>
            }
          </label>
          <span class="text-gray-500">{{ displayValue() }}</span>
        </div>
      }

      <!-- Slider Container -->
      <div [class]="sliderClasses()" 
           (mousedown)="onTrackMouseDown($event)"
           (touchstart)="onTrackTouchStart($event)"
           #sliderRef>
        
        <!-- Track -->
        <div [class]="trackClasses()" #trackRef>
          <!-- Range (filled portion) -->
          <div [class]="rangeClasses()" 
               [style.left.%]="rangeStart()"
               [style.width.%]="rangeWidth()">
          </div>

          <!-- Steps (if enabled) -->
          @if (showSteps()) {
            @for (stepPosition of stepPositions(); track stepPosition) {
              <div class="absolute top-1/2 w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                   [style.left.%]="stepPosition">
              </div>
            }
          }
        </div>

        <!-- Thumbs -->
        @if (range()) {
          <!-- Start thumb for range -->
          <div [class]="thumbClasses()"
               [style.left.%]="thumbPositions()[0]"
               (mousedown)="onThumbMouseDown($event, 0)"
               (touchstart)="onThumbTouchStart($event, 0)"
               tabindex="0"
               role="slider"
               [attr.aria-valuemin]="min()"
               [attr.aria-valuemax]="max()"
               [attr.aria-valuenow]="isRangeValue() ? rangeValue()[0] : singleValue()">
          </div>
          
          <!-- End thumb for range -->
          <div [class]="thumbClasses()"
               [style.left.%]="thumbPositions()[1]"
               (mousedown)="onThumbMouseDown($event, 1)"
               (touchstart)="onThumbTouchStart($event, 1)"
               tabindex="0"
               role="slider"
               [attr.aria-valuemin]="min()"
               [attr.aria-valuemax]="max()"
               [attr.aria-valuenow]="isRangeValue() ? rangeValue()[1] : singleValue()">
          </div>
        } @else {
          <!-- Single thumb -->
          <div [class]="thumbClasses()"
               [style.left.%]="thumbPositions()[0]"
               (mousedown)="onThumbMouseDown($event, 0)"
               (touchstart)="onThumbTouchStart($event, 0)"
               tabindex="0"
               role="slider"
               [attr.aria-valuemin]="min()"
               [attr.aria-valuemax]="max()"
               [attr.aria-valuenow]="singleValue()">
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
export class HcSlider implements ControlValueAccessor {
  // Input properties
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly min = input<number>(0);
  public readonly max = input<number>(100);
  public readonly step = input<number>(1);
  public readonly value = input<number | [number, number]>(0);
  public readonly range = input<boolean>(false);
  public readonly showSteps = input<boolean>(false);
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly variant = input<'default' | 'success' | 'warning' | 'error'>('default');
  public readonly class = input<string>('');

  // Output events
  public readonly valueChange = output<number | [number, number]>();

  // Internal state
  private readonly internalValue = signal<number | [number, number]>(0);
  private readonly isDragging = signal<boolean>(false);
  private readonly activeThumb = signal<number>(-1);
  private readonly hasInteracted = signal<boolean>(false);

  // Element references
  private readonly sliderRef = viewChild<ElementRef<HTMLElement>>('sliderRef');
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('trackRef');

  // Control Value Accessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Initialize with proper value on first load
    effect(() => {
      const currentValue = this.value();
      if (currentValue !== undefined && currentValue !== null) {
        this.internalValue.set(currentValue);
      } else {
        // Set default value based on range mode
        const defaultValue = this.getInitialValue();
        this.internalValue.set(defaultValue);
      }
    });
  }

  private getInitialValue(): number | [number, number] {
    if (this.range()) {
      const minVal = this.min();
      const maxVal = this.max();
      const quarter = (maxVal - minVal) * 0.25;
      const threeQuarter = (maxVal - minVal) * 0.75;
      return [minVal + quarter, minVal + threeQuarter];
    } else {
      const minVal = this.min();
      const maxVal = this.max();
      return minVal + (maxVal - minVal) * 0.5; // Start at middle
    }
  }

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('relative w-full', this.class())
  );

  protected readonly sliderClasses = computed(() =>
    cn(
      sliderVariants({
        size: this.size()
      }),
      this.disabled() && 'opacity-50 cursor-not-allowed'
    )
  );

  protected readonly trackClasses = computed(() =>
    cn(
      sliderTrackVariants({
        variant: this.variant()
      })
    )
  );

  protected readonly rangeClasses = computed(() =>
    cn(
      sliderRangeVariants({
        variant: this.variant()
      })
    )
  );

  protected readonly thumbClasses = computed(() =>
    cn(
      sliderThumbVariants({
        variant: this.variant()
      })
    )
  );

  protected readonly isRangeValue = computed(() => 
    Array.isArray(this.currentValue())
  );

  protected readonly currentValue = computed(() => {
    // If we're currently dragging or have interacted with the slider, use internal value
    if (this.isDragging() || this.hasInteracted()) {
      const internal = this.internalValue();
      if (internal !== undefined && internal !== null) {
        return internal;
      }
    }
    
    // Otherwise, use provided value if it exists
    const provided = this.value();
    if (provided !== undefined && provided !== null) {
      return provided;
    }
    
    // Use internal value as fallback
    const internal = this.internalValue();
    if (internal !== undefined && internal !== null) {
      return internal;
    }
    
    // Return appropriate default based on range mode
    if (this.range()) {
      const minVal = this.min();
      const maxVal = this.max();
      const quarter = minVal + (maxVal - minVal) * 0.25;
      const threeQuarter = minVal + (maxVal - minVal) * 0.75;
      return [quarter, threeQuarter];
    } else {
      const minVal = this.min();
      const maxVal = this.max();
      return minVal + (maxVal - minVal) * 0.5;
    }
  });

  protected readonly singleValue = computed(() => 
    this.isRangeValue() ? (this.currentValue() as [number, number])[0] : this.currentValue() as number
  );

  protected readonly rangeValue = computed(() => 
    this.isRangeValue() ? this.currentValue() as [number, number] : [this.currentValue() as number, this.currentValue() as number]
  );

  protected readonly displayValue = computed(() => {
    if (this.range()) {
      const [start, end] = this.rangeValue();
      return `${start} - ${end}`;
    }
    return this.singleValue().toString();
  });

  protected readonly thumbPositions = computed(() => {
    const minVal = this.min();
    const maxVal = this.max();
    const range = maxVal - minVal;

    if (this.range()) {
      const [start, end] = this.rangeValue();
      return [
        ((start - minVal) / range) * 100,
        ((end - minVal) / range) * 100
      ];
    } else {
      const val = this.singleValue();
      return [((val - minVal) / range) * 100];
    }
  });

  protected readonly rangeStart = computed(() => {
    if (this.range()) {
      return this.thumbPositions()[0];
    }
    return 0;
  });

  protected readonly rangeWidth = computed(() => {
    if (this.range()) {
      return this.thumbPositions()[1] - this.thumbPositions()[0];
    }
    return this.thumbPositions()[0];
  });

  protected readonly stepPositions = computed(() => {
    if (!this.showSteps()) return [];
    
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step();
    const range = maxVal - minVal;
    const positions: number[] = [];

    for (let val = minVal; val <= maxVal; val += stepVal) {
      positions.push(((val - minVal) / range) * 100);
    }

    return positions;
  });

  // Event handlers
  protected onTrackMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.handlePointerDown(event.clientX);
  }

  protected onTrackTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.handlePointerDown(event.touches[0].clientX);
  }

  protected onThumbMouseDown(event: MouseEvent, thumbIndex: number): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.hasInteracted.set(true);
    this.activeThumb.set(thumbIndex);
    this.isDragging.set(true);
    this.addGlobalListeners();
  }

  protected onThumbTouchStart(event: TouchEvent, thumbIndex: number): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.hasInteracted.set(true);
    this.activeThumb.set(thumbIndex);
    this.isDragging.set(true);
    this.addGlobalTouchListeners();
  }

  private handlePointerDown(clientX: number): void {
    const trackElement = this.trackRef()?.nativeElement;
    if (!trackElement) return;

    this.hasInteracted.set(true);
    const rect = trackElement.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const newValue = this.percentageToValue(percentage);

    if (this.range()) {
      const [start, end] = this.rangeValue();
      const distToStart = Math.abs(newValue - start);
      const distToEnd = Math.abs(newValue - end);
      
      if (distToStart < distToEnd) {
        this.updateRangeValue(newValue, end);
        this.activeThumb.set(0);
      } else {
        this.updateRangeValue(start, newValue);
        this.activeThumb.set(1);
      }
    } else {
      this.updateSingleValue(newValue);
      this.activeThumb.set(0);
    }

    this.isDragging.set(true);
    this.addGlobalListeners();
  }

  private addGlobalListeners(): void {
    const handleMouseMove = (e: MouseEvent) => this.handleGlobalPointerMove(e.clientX);
    const handleMouseUp = () => this.handleGlobalPointerUp();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    setTimeout(() => {
      if (!this.isDragging()) cleanup();
    }, 5000); // Safety cleanup
  }

  private addGlobalTouchListeners(): void {
    const handleTouchMove = (e: TouchEvent) => this.handleGlobalPointerMove(e.touches[0].clientX);
    const handleTouchEnd = () => this.handleGlobalPointerUp();

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    const cleanup = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    setTimeout(() => {
      if (!this.isDragging()) cleanup();
    }, 5000); // Safety cleanup
  }

  private handleGlobalPointerMove(clientX: number): void {
    if (!this.isDragging()) return;

    const trackElement = this.trackRef()?.nativeElement;
    if (!trackElement) return;

    const rect = trackElement.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = this.percentageToValue(percentage);

    if (this.range()) {
      const currentRange = this.rangeValue();
      if (this.activeThumb() === 0) {
        this.updateRangeValue(newValue, currentRange[1]);
      } else {
        this.updateRangeValue(currentRange[0], newValue);
      }
    } else {
      this.updateSingleValue(newValue);
    }
  }

  private handleGlobalPointerUp(): void {
    this.isDragging.set(false);
    this.activeThumb.set(-1);
    this.onTouched();
  }

  private percentageToValue(percentage: number): number {
    const minVal = this.min();
    const maxVal = this.max();
    const stepVal = this.step();
    const range = maxVal - minVal;
    
    const rawValue = minVal + (percentage / 100) * range;
    const steppedValue = Math.round(rawValue / stepVal) * stepVal;
    
    return Math.max(minVal, Math.min(maxVal, steppedValue));
  }

  private updateSingleValue(newValue: number): void {
    this.hasInteracted.set(true);
    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  private updateRangeValue(start: number, end: number): void {
    this.hasInteracted.set(true);
    const sortedValues: [number, number] = start <= end ? [start, end] : [end, start];
    this.internalValue.set(sortedValues);
    this.onChange(sortedValues);
    this.valueChange.emit(sortedValues);
  }

  // ControlValueAccessor implementation
  public writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.internalValue.set(value);
    }
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
