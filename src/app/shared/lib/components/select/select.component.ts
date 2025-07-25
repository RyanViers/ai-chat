import { Component, computed, input, output, signal, forwardRef, effect, inject, DOCUMENT } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const selectVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base'
      },
      state: {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default'
    }
  }
);

const selectOptionVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-gray-900 focus:bg-blue-50 focus:text-blue-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      selected: {
        true: 'bg-blue-50 text-blue-900',
        false: 'hover:bg-gray-50'
      }
    },
    defaultVariants: {
      selected: false
    }
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectVariants = VariantProps<typeof selectVariants>;

@Component({
  selector: 'hc-select',
  imports: [],
  host: {
    '[class]': 'computedClasses()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HcSelect),
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

      <!-- Select Trigger -->
      <button
        type="button"
        [class]="selectClasses()"
        [disabled]="disabled()"
        (click)="toggleDropdown()"
        (blur)="onTriggerBlur($event)"
        #trigger>
        <span [class.text-gray-400]="!selectedOptionLabel()" [class.text-gray-900]="selectedOptionLabel()">
          {{ selectedOptionLabel() || placeholder() }}
        </span>
        <svg 
          class="h-4 w-4 opacity-50 transition-transform duration-200 text-gray-400"
          [class.rotate-180]="dropdownOpen()"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown -->
      @if (dropdownOpen()) {
        <div 
          class="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border mt-1 w-full bg-white border-gray-200 shadow-lg p-1"
          (click)="onDropdownClick($event)">
          
          <!-- Search Input (if searchable) -->
          @if (searchable()) {
            <div class="flex items-center border-b border-gray-100 px-3 pb-2 mb-1">
              <svg class="mr-2 h-4 w-4 shrink-0 opacity-50 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                class="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 border-0 focus:ring-0"
                placeholder="Search..."
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                (keydown)="onSearchKeydown($event)"
                (focus)="onSearchFocus()"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                autocomplete="off"
                #searchInput
              />
            </div>
          }

          <!-- Options -->
          <div class="max-h-60 overflow-auto">
            @if (filteredOptions().length === 0) {
              <div class="py-6 text-center text-sm text-gray-500">
                {{ searchQuery() ? 'No results found.' : 'No options available.' }}
              </div>
            } @else {
              @for (option of filteredOptions(); track option.value) {
                <div
                  [class]="getOptionClasses(option)"
                  [attr.data-disabled]="option.disabled"
                  (click)="selectOption(option)"
                  (mouseenter)="setHoveredOption(option.value)">
                  
                  <!-- Checkmark for selected option -->
                  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    @if (isOptionSelected(option)) {
                      <svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </span>
                  
                  {{ option.label }}
                </div>
              }
            }
          </div>
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
export class HcSelect implements ControlValueAccessor {
  // Input properties
  public readonly options = input<SelectOption[]>([]);
  public readonly placeholder = input<string>('Select an option...');
  public readonly label = input<string>('');
  public readonly helpText = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly searchable = input<boolean>(false);
  public readonly multiple = input<boolean>(false);
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly state = input<'default' | 'error' | 'success'>('default');
  public readonly class = input<string>('');

  // Output events
  public readonly selectionChange = output<SelectOption | SelectOption[] | null>();
  public readonly valueChange = output<string | string[] | null>();

  // Internal state
  private readonly value = signal<string | string[] | null>(null);
  protected readonly dropdownOpen = signal<boolean>(false);
  protected readonly searchQuery = signal<string>('');
  private readonly hoveredOption = signal<string | null>(null);

  // Control Value Accessor
  private onChange = (value: any) => {};
  private onTouched = () => {};
  private readonly document = inject(DOCUMENT);

  constructor() {
    // Add document click listener to close dropdown
    effect(() => {
      if (this.dropdownOpen()) {
        const clickListener = (event: Event) => {
          const target = event.target as HTMLElement;
          // More specific check - make sure click is outside the entire select component
          const selectComponent = target.closest('hc-select');
          if (!selectComponent) {
            this.closeDropdown();
          }
        };
        
        // Add slight delay to allow click events to process first
        setTimeout(() => {
          this.document.addEventListener('click', clickListener);
        }, 10);
        
        return () => {
          this.document.removeEventListener('click', clickListener);
        };
      }
      return () => {};
    });
  }

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('relative', this.class())
  );

  protected readonly selectClasses = computed(() =>
    cn(
      selectVariants({
        size: this.size(),
        state: this.errorMessage() ? 'error' : this.state()
      })
    )
  );

  protected readonly selectedOptionLabel = computed(() => {
    const currentValue = this.value();
    if (!currentValue) return '';

    if (this.multiple()) {
      const values = Array.isArray(currentValue) ? currentValue : [currentValue];
      const selectedOptions = this.options().filter(opt => values.includes(opt.value));
      if (selectedOptions.length === 0) return '';
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} selected`;
    } else {
      const option = this.options().find(opt => opt.value === currentValue);
      return option?.label || '';
    }
  });

  protected readonly filteredOptions = computed(() => {
    const term = this.searchQuery().toLowerCase();
    const allOptions = this.options();
    
    if (!term) return allOptions;
    
    return allOptions.filter(option =>
      option.label.toLowerCase().includes(term) ||
      option.value.toLowerCase().includes(term)
    );
  });

  // Methods
  protected toggleDropdown(): void {
    if (this.disabled()) return;
    
    const newState = !this.dropdownOpen();
    this.dropdownOpen.set(newState);
    
    // Clear search when opening dropdown
    if (newState && this.searchable()) {
      this.searchQuery.set('');
    }
  }

  protected selectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (this.multiple()) {
      const currentValues = Array.isArray(this.value()) ? this.value() as string[] : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      
      this.value.set(newValues);
      this.onChange(newValues);
      this.valueChange.emit(newValues);
      
      const selectedOptions = this.options().filter(opt => newValues.includes(opt.value));
      this.selectionChange.emit(selectedOptions);
      // Keep dropdown open for multi-select
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
      this.valueChange.emit(option.value);
      this.selectionChange.emit(option);
      this.dropdownOpen.set(false);
    }
  }

  protected closeDropdown(): void {
    this.dropdownOpen.set(false);
    this.onTouched();
  }

  protected isOptionSelected(option: SelectOption): boolean {
    const currentValue = this.value();
    if (this.multiple()) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      return values.includes(option.value);
    }
    return currentValue === option.value;
  }

  protected getOptionClasses(option: SelectOption): string {
    return cn(
      selectOptionVariants({
        selected: this.isOptionSelected(option)
      }),
      option.disabled && 'opacity-50 cursor-not-allowed',
      this.hoveredOption() === option.value && !option.disabled && 'bg-gray-100'
    );
  }

  protected setHoveredOption(value: string): void {
    this.hoveredOption.set(value);
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    // Prevent enter key from submitting form
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      
      // Optionally select first filtered option on Enter
      const filteredOpts = this.filteredOptions();
      if (filteredOpts.length > 0) {
        this.selectOption(filteredOpts[0]);
      }
    }
    
    // Prevent space from closing dropdown
    if (event.key === ' ') {
      event.stopPropagation();
    }
    
    // Allow Escape to close dropdown
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  protected onBlur(): void {
    // Delay closing to allow option selection
    // Don't close if user is interacting with search input
    setTimeout(() => {
      if (!this.dropdownOpen()) return;
      this.dropdownOpen.set(false);
      this.onTouched();
    }, 150);
  }

  protected onTriggerBlur(event: FocusEvent): void {
    // Only close if focus is not moving to the dropdown
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('.absolute')) {
      this.onBlur();
    }
  }

  protected onSearchFocus(): void {
    // Keep dropdown open when search input is focused
    if (!this.dropdownOpen()) {
      this.dropdownOpen.set(true);
    }
  }

  protected onDropdownClick(event: Event): void {
    // Prevent dropdown from closing when clicking inside
    event.stopPropagation();
  }

  // ControlValueAccessor implementation
  public writeValue(value: any): void {
    this.value.set(value);
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
