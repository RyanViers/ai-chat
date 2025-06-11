import { Component, signal } from '@angular/core';
import { HlmButtonDirective } from '../../shared/components/ui-button-helm/src/lib/hlm-button.directive';

@Component({
  selector: 'spartan-button-preview',
  imports: [HlmButtonDirective],
  template: `
    <div class="space-y-12 p-6">
      
      <!-- Basic Variants -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Button Variants</h2>
        <div class="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <button hlmBtn variant="default">Default</button>
          <button hlmBtn variant="destructive">Destructive</button>
          <button hlmBtn variant="outline">Outline</button>
          <button hlmBtn variant="secondary">Secondary</button>
          <button hlmBtn variant="ghost">Ghost</button>
          <button hlmBtn variant="link">Link</button>
        </div>
      </section>

      <!-- Sizes -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Button Sizes</h2>
        <div class="flex flex-wrap items-center gap-4">
          <button hlmBtn size="sm">Small</button>
          <button hlmBtn size="default">Default</button>
          <button hlmBtn size="lg">Large</button>
          <button hlmBtn size="icon" class="w-10 h-10">⚙️</button>
        </div>
      </section>      <!-- Outlines Variants -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Outline Variants</h2>
        <div class="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <button hlmBtn variant="outline" class="border-pink-500 text-primary hover:bg-pink-500 hover:text-primary-foreground">Primary</button>
          <button hlmBtn variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">Destructive</button>
          <button hlmBtn variant="outline" class="border-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground">Secondary</button>
          <button hlmBtn variant="outline" class="border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground">Accent</button>
        </div>
      </section>      <!-- Ghosts Variants -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Ghost Variants</h2>
        <div class="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <button hlmBtn variant="ghost" class="text-primary hover:bg-primary hover:text-primary-foreground">Primary</button>
            <button hlmBtn variant="ghost" class="text-destructive hover:bg-destructive hover:text-destructive-foreground">Destructive</button>
            <button hlmBtn variant="ghost" class="text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground">Secondary</button>
            <button hlmBtn variant="ghost" class="text-accent-foreground hover:bg-accent hover:text-accent-foreground">Accent</button>
          </div>
      </section>      <!-- Links Variants -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Link Variants</h2>
        <div class="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <button hlmBtn variant="link" class="text-primary hover:underline">Primary Link</button>
          <button hlmBtn variant="link" class="text-destructive hover:underline">Destructive Link</button>
          <button hlmBtn variant="link" class="text-secondary-foreground hover:underline">Secondary Link</button>
          <button hlmBtn variant="link" class="text-accent-foreground hover:underline">Accent Link</button>
        </div>
      </section>

      <!-- With Text Icons -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Buttons with Text Icons</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button hlmBtn variant="default" class="gap-2">
            📥 Download
          </button>
          <button hlmBtn variant="outline" class="gap-2">
            ➕ Add Item
          </button>
          <button hlmBtn variant="secondary" class="gap-2">
            🔗 Share
          </button>
          <button hlmBtn variant="destructive" class="gap-2">
            🗑️ Delete
          </button>
        </div>
      </section>

      <!-- Icon Only Buttons -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Icon Only Buttons</h2>
        <div class="flex gap-4">
          <button hlmBtn size="icon" variant="default">❤️</button>
          <button hlmBtn size="icon" variant="outline">✏️</button>
          <button hlmBtn size="icon" variant="ghost">🔍</button>
          <button hlmBtn size="icon" variant="secondary">⚙️</button>
          <button hlmBtn size="icon" variant="destructive">🗑️</button>
        </div>
      </section>

      <!-- Loading States -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Loading States</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button hlmBtn [disabled]="isLoading()" (click)="toggleLoading()">
            @if (isLoading()) {
              ⏳ Loading...
            } @else {
              Click to Load
            }
          </button>
          <button hlmBtn variant="outline" disabled>
            ⏳ Processing...
          </button>
          <button hlmBtn variant="secondary" disabled>
            Disabled
          </button>
          <button hlmBtn variant="destructive" disabled>
            Cannot Delete
          </button>
        </div>
      </section>

      <!-- Button Groups -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Button Groups</h2>
        <div class="space-y-4">
          <!-- Segmented Control Style -->
          <div class="inline-flex rounded-lg border overflow-hidden">
            <button hlmBtn variant="ghost" class="rounded-none border-r"
                    [class.bg-primary]="activeTab() === 'tab1'"
                    [class.text-primary]="activeTab() === 'tab1'"
                    (click)="setActiveTab('tab1')">
              Tab 1
            </button>
            <button hlmBtn variant="ghost" class="rounded-none border-r"
                    [class.bg-primary]="activeTab() === 'tab2'"
                    [class.text-primary]="activeTab() === 'tab2'"
                    (click)="setActiveTab('tab2')">
              Tab 2
            </button>
            <button hlmBtn variant="ghost" class="rounded-none"
                    [class.bg-primary]="activeTab() === 'tab3'"
                    [class.text-primary]="activeTab() === 'tab3'"
                    (click)="setActiveTab('tab3')">
              Tab 3
            </button>
          </div>

          <!-- Action Group -->
          <div class="flex gap-2">
            <button hlmBtn variant="default">Save</button>
            <button hlmBtn variant="outline">Cancel</button>
            <button hlmBtn variant="ghost">Reset</button>
          </div>
        </div>
      </section>

      <!-- Rounded Variations -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Rounded Variations</h2>
        <div class="flex flex-wrap gap-4">
          <button hlmBtn class="rounded-none">No Radius</button>
          <button hlmBtn class="rounded-sm">Small Radius</button>
          <button hlmBtn class="rounded-md">Medium Radius</button>
          <button hlmBtn class="rounded-lg">Large Radius</button>
          <button hlmBtn class="rounded-xl">XL Radius</button>
          <button hlmBtn class="rounded-full">Full Radius</button>
        </div>
      </section>

      <!-- Interactive Examples -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Interactive Examples</h2>
        <div class="space-y-4">
          <div class="flex gap-4 items-center">
            <button hlmBtn (click)="incrementCounter()">
              Clicked {{ clickCount() }} times
            </button>
            <button hlmBtn variant="outline" (click)="resetCounter()">
              Reset
            </button>
          </div>
          
          <div class="flex gap-4 items-center">
            <button hlmBtn [class.bg-destructive]="isToggled()" 
                    [class.text-destructive-foreground]="isToggled()"
                    [class.hover:bg-destructive]="isToggled()"
                    (click)="toggle()">
              {{ isToggled() ? 'ON' : 'OFF' }}
            </button>
            <span class="text-sm text-muted-foreground">
              Toggle state: {{ isToggled() ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Call-to-Action Buttons -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Call-to-Action Buttons</h2>
        <div class="space-y-4">
          <button hlmBtn size="lg" class="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground text-lg py-4">
            🚀 Get Started for Free
          </button>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button hlmBtn size="lg" variant="default">
              📥 Download Now
            </button>
            <button hlmBtn size="lg" variant="outline" class="border-2">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <!-- Custom Styled Buttons with Spartan Variables -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Custom Styled Buttons</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Using CSS custom properties for theming -->
          <button hlmBtn class="bg-blue-600 hover:bg-blue-700 text-white">
            Blue Theme
          </button>
          <button hlmBtn class="bg-green-600 hover:bg-green-700 text-white">
            Success
          </button>
          <button hlmBtn class="bg-orange-500 hover:bg-orange-600 text-white">
            Warning
          </button>
          <button hlmBtn class="bg-purple-600 hover:bg-purple-700 text-white">
            Purple
          </button>
        </div>
      </section>

    </div>
  `,
})
export class ButtonPreviewComponent {
  isLoading = signal(false);
  clickCount = signal(0);
  isToggled = signal(false);
  activeTab = signal('tab1');

  toggleLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
  }

  incrementCounter(): void {
    this.clickCount.update(count => count + 1);
  }

  resetCounter(): void {
    this.clickCount.set(0);
  }

  toggle(): void {
    this.isToggled.update(state => !state);
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
}