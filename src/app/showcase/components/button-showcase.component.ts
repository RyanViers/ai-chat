import { Component, signal } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'spartan-button-preview',
  imports: [HlmButtonDirective],
  template: `
    <div class="space-y-12 p-6">
      
      <!-- Basic Variants -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Variants</h2>
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
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Sizes</h2>
        <div class="flex flex-wrap items-center gap-4">
          <button hlmBtn size="sm">Small</button>
          <button hlmBtn size="default">Default</button>
          <button hlmBtn size="lg">Large</button>
          <button hlmBtn size="icon" class="w-10 h-10">⚙️</button>
        </div>
      </section>

      <!-- With Text Icons -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Buttons with Text Icons</h2>
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
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Icon Only Buttons</h2>
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
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Loading States</h2>
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

      <!-- Custom Colors (using Tailwind classes) -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Custom Colored Buttons</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button hlmBtn class="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            Blue
          </button>
          <button hlmBtn class="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600">
            Green
          </button>
          <button hlmBtn class="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600">
            Purple
          </button>
          <button hlmBtn class="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600">
            Orange
          </button>
          <button hlmBtn class="bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-500 dark:hover:bg-pink-600">
            Pink
          </button>
          <button hlmBtn class="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
            Indigo
          </button>
          <button hlmBtn class="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600">
            Teal
          </button>
          <button hlmBtn class="bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-black">
            Yellow
          </button>
        </div>
      </section>

      <!-- Button Groups -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Groups</h2>
        <div class="space-y-4">
          <!-- Segmented Control Style -->
          <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button hlmBtn variant="ghost" class="rounded-none border-r border-gray-200 dark:border-gray-700" 
                    [class.bg-blue-50]="activeTab() === 'tab1'"
                    [class.dark:bg-blue-900]="activeTab() === 'tab1'"
                    (click)="setActiveTab('tab1')">
              Tab 1
            </button>
            <button hlmBtn variant="ghost" class="rounded-none border-r border-gray-200 dark:border-gray-700"
                    [class.bg-blue-50]="activeTab() === 'tab2'"
                    [class.dark:bg-blue-900]="activeTab() === 'tab2'"
                    (click)="setActiveTab('tab2')">
              Tab 2
            </button>
            <button hlmBtn variant="ghost" class="rounded-none"
                    [class.bg-blue-50]="activeTab() === 'tab3'"
                    [class.dark:bg-blue-900]="activeTab() === 'tab3'"
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
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Rounded Variations</h2>
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
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Interactive Examples</h2>
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
            <button hlmBtn [class.bg-red-600]="isToggled()" 
                    [class.hover:bg-red-700]="isToggled()"
                    [class.dark:bg-red-500]="isToggled()"
                    [class.dark:hover:bg-red-600]="isToggled()"
                    (click)="toggle()">
              {{ isToggled() ? 'ON' : 'OFF' }}
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Toggle state: {{ isToggled() ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Large Call-to-Action Buttons -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Call-to-Action Buttons</h2>
        <div class="space-y-4">
          <button hlmBtn size="lg" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white text-lg py-4">
            🚀 Get Started for Free
          </button>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button hlmBtn size="lg" class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
              📥 Download Now
            </button>
            <button hlmBtn size="lg" variant="outline" class="border-2">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <!-- Gradient Buttons -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gradient Buttons</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button hlmBtn class="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
            Pink to Red
          </button>
          <button hlmBtn class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            Blue to Cyan
          </button>
          <button hlmBtn class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
            Green to Blue
          </button>
          <button hlmBtn class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Purple to Pink
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