import { Component, input, computed, signal, output } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  badge?: string;
}

const tabsVariants = cva(
  'flex',
  {
    variants: {
      orientation: {
        horizontal: 'w-full border-b border-gray-200',
        vertical: 'flex-col w-48 border-r border-gray-200 pr-4'
      },
      variant: {
        default: '',
        pills: 'bg-gray-100 p-1 rounded-lg',
        underline: '',
        bordered: 'border border-gray-200 rounded-lg p-1'
      }
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default'
    }
  }
);

const tabButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 data-[active=true]:border-blue-500 data-[active=true]:text-blue-600',
        pills: 'text-gray-700 hover:bg-white hover:shadow-sm data-[active=true]:bg-white data-[active=true]:text-slate-950 data-[active=true]:shadow-sm',
        underline: 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 data-[active=true]:border-blue-500 data-[active=true]:text-blue-600',
        bordered: 'text-gray-700 hover:bg-gray-50 data-[active=true]:bg-white data-[active=true]:border data-[active=true]:border-gray-200 data-[active=true]:shadow-sm'
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start'
      }
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal'
    }
  }
);

const tabContentVariants = cva(
  'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2',
  {
    variants: {
      orientation: {
        horizontal: 'w-full',
        vertical: 'flex-1 ml-4'
      }
    },
    defaultVariants: {
      orientation: 'horizontal'
    }
  }
);

type TabsVariants = VariantProps<typeof tabsVariants>;

@Component({
  selector: 'hc-tabs',
  imports: [],
  host: {
    '[class]': 'computedClasses()'
  },
  template: `
    <div [class]="containerClasses()">
      <!-- Tab List -->
      <div [class]="tabsClasses()" role="tablist">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            [class]="tabButtonClasses()"
            [attr.data-active]="activeTab() === tab.id"
            [disabled]="tab.disabled"
            [attr.aria-selected]="activeTab() === tab.id"
            [attr.aria-controls]="'panel-' + tab.id"
            [attr.id]="'tab-' + tab.id"
            (click)="selectTab(tab.id)">
            
            {{ tab.label }}
            
            @if (tab.badge) {
              <span class="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Tab Content -->
      <div [class]="contentClasses()">
        @for (tab of tabs(); track tab.id) {
          @if (activeTab() === tab.id) {
            <div
              role="tabpanel"
              [attr.id]="'panel-' + tab.id"
              [attr.aria-labelledby]="'tab-' + tab.id"
              tabindex="0">
              <ng-content [select]="'[slot=' + tab.id + ']'"></ng-content>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class HcTabs {
  // Input properties
  public readonly tabs = input.required<TabItem[]>();
  public readonly defaultTab = input<string>('');
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  public readonly variant = input<'default' | 'pills' | 'underline' | 'bordered'>('default');
  public readonly fullWidth = input<boolean>(true);
  public readonly class = input<string>('');

  // Output events
  public readonly tabChange = output<string>();

  // Internal state
  protected readonly activeTab = signal<string>('');

  constructor() {
    // Set initial active tab
    setTimeout(() => {
      const initialTab = this.defaultTab() || this.tabs()[0]?.id || '';
      if (initialTab && !this.activeTab()) {
        this.activeTab.set(initialTab);
      }
    });
  }

  // Computed properties
  protected readonly computedClasses = computed(() => 
    cn('w-full', this.class())
  );

  protected readonly containerClasses = computed(() => {
    if (this.orientation() === 'vertical') {
      return 'flex w-full';
    }
    return 'w-full';
  });

  protected readonly tabsClasses = computed(() =>
    cn(
      tabsVariants({
        orientation: this.orientation(),
        variant: this.variant()
      })
    )
  );

  protected readonly tabButtonClasses = computed(() =>
    cn(
      tabButtonVariants({
        variant: this.variant(),
        orientation: this.orientation()
      }),
      this.fullWidth() && this.orientation() === 'horizontal' && 'flex-1'
    )
  );

  protected readonly contentClasses = computed(() =>
    cn(
      tabContentVariants({
        orientation: this.orientation()
      })
    )
  );

  // Methods
  protected selectTab(tabId: string): void {
    const tab = this.tabs().find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      this.activeTab.set(tabId);
      this.tabChange.emit(tabId);
    }
  }
}
