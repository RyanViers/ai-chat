import { Component, signal } from '@angular/core';
import { DemoNavigationComponent, DemoPage } from './demo-navigation.component';
import { DemoPage2Component } from './demo-page-2.component';
import { HcButton } from '../shared/lib/components/button/button.component';
import { HcInput } from '../shared/lib/components/input/input.component';
import { HcCard } from '../shared/lib/components/card/card.component';
import { HcBadge } from '../shared/lib/components/badge/badge.component';
import { DemoPage3Component } from './demo-page-3.component';

/**
 * Main demo component with navigation between different component showcases
 */
@Component({
  selector: 'app-tailwindui-demo',
  imports: [
    DemoNavigationComponent, 
    DemoPage2Component,
    DemoPage3Component,
    HcButton, 
    HcInput, 
    HcCard, 
    HcBadge
  ],
  host: {
    class: 'block h-full w-full'
  },
  template: `
    <div class="bg-slate-500 h-full w-full flex overflow-hidden">
      <!-- Navigation Sidebar -->
      <app-demo-navigation
        [pages]="demoPages"
        [activePage]="currentPage()"
        (pageSelect)="onPageSelect($event)">
      </app-demo-navigation>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-auto">
        <div class="p-8 max-w-6xl mx-auto">
          @if (currentPage() === 'page2') {
            <app-demo-page-2></app-demo-page-2>
          } @else if (currentPage() === 'page3') {
            <app-demo-page-3></app-demo-page-3>
          } @else {
            <!-- Page 1: Core Components Demo -->
            <div class="space-y-12">
              <header class="text-center">
                <h1 class="text-4xl font-bold text-gray-900">Headcount UI Component Library</h1>
                <p class="mt-2 text-lg text-gray-600">TailwindUI-inspired components built with Angular signals</p>
              </header>
            
              <!-- Button Showcase -->
              <hc-card [hasHeader]="true">
                <div slot="header">
                  <h2 class="text-xl font-semibold text-gray-800">Buttons</h2>
                  <p class="text-sm text-gray-600">All TailwindUI button variants and sizes</p>
                </div>
                
                <!-- Button Variants -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Variants</h3>
                    <div class="flex flex-wrap gap-3">
                      <hc-button variant="primary" [class]="'bg-green-500'">Primary</hc-button>
                      <hc-button variant="secondary">Secondary</hc-button>
                      <hc-button variant="soft">Soft</hc-button>
                      <hc-button variant="outline">Outline</hc-button>
                      <hc-button variant="ghost" [class]="'hover:bg-green-500'">Ghost</hc-button>
                      <hc-button variant="link">Link</hc-button>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
                    <div class="flex flex-wrap items-center gap-3">
                      <hc-button size="xs">Extra Small</hc-button>
                      <hc-button size="sm">Small</hc-button>
                      <hc-button size="md">Medium</hc-button>
                      <hc-button size="lg">Large</hc-button>
                      <hc-button size="xl">Extra Large</hc-button>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">States</h3>
                    <div class="flex flex-wrap gap-3">
                      <hc-button>Normal</hc-button>
                      <hc-button [loading]="true">Loading</hc-button>
                      <hc-button [disabled]="true">Disabled</hc-button>
                    </div>
                  </div>
                </div>
              </hc-card>

              <!-- Input Showcase -->
              <hc-card [hasHeader]="true">
                <div slot="header">
                  <h2 class="text-xl font-semibold text-gray-800">Inputs</h2>
                  <p class="text-sm text-gray-600">Form inputs with validation states</p>
                </div>
                
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <hc-input 
                      label="Email Address" 
                      type="email" 
                      placeholder="Enter your email"
                      helpText="We'll never share your email.">
                    </hc-input>

                    <hc-input 
                      label="Password" 
                      type="password" 
                      placeholder="Enter your password"
                      [required]="true">
                    </hc-input>

                    <hc-input 
                      label="Full Name" 
                      placeholder="John Doe"
                      state="success"
                      helpText="Looks good!">
                    </hc-input>

                    <hc-input 
                      label="Phone Number" 
                      type="tel" 
                      placeholder="(555) 123-4567"
                      errorMessage="Please enter a valid phone number.">
                    </hc-input>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Input Sizes</h3>
                    <div class="space-y-3">
                      <hc-input size="sm" placeholder="Small input"></hc-input>
                      <hc-input size="md" placeholder="Medium input"></hc-input>
                      <hc-input size="lg" placeholder="Large input"></hc-input>
                    </div>
                  </div>
                </div>
              </hc-card>

              <!-- Badge Showcase -->
              <hc-card [hasHeader]="true">
                <div slot="header">
                  <h2 class="text-xl font-semibold text-gray-800">Badges</h2>
                  <p class="text-sm text-gray-600">Status indicators and labels</p>
                </div>
                
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Variants</h3>
                    <div class="flex flex-wrap gap-2">
                      <hc-badge variant="default">Default</hc-badge>
                      <hc-badge variant="primary">Primary</hc-badge>
                      <hc-badge variant="success">Success</hc-badge>
                      <hc-badge variant="warning">Warning</hc-badge>
                      <hc-badge variant="error">Error</hc-badge>
                      <hc-badge variant="info">Info</hc-badge>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">With Status Dots</h3>
                    <div class="flex flex-wrap gap-2">
                      <hc-badge variant="success" [leadingIcon]="true">Online</hc-badge>
                      <hc-badge variant="warning" [leadingIcon]="true">Away</hc-badge>
                      <hc-badge variant="error" [leadingIcon]="true">Offline</hc-badge>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
                    <div class="flex flex-wrap items-center gap-2">
                      <hc-badge size="sm">Small</hc-badge>
                      <hc-badge size="md">Medium</hc-badge>
                      <hc-badge size="lg">Large</hc-badge>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-3">Removable</h3>
                    <div class="flex flex-wrap gap-2">
                      <hc-badge variant="primary" [removable]="true">React</hc-badge>
                      <hc-badge variant="success" [removable]="true">Angular</hc-badge>
                      <hc-badge variant="info" [removable]="true">Vue</hc-badge>
                    </div>
                  </div>
                </div>
              </hc-card>

              <!-- Card Showcase -->
              <hc-card [hasHeader]="true">
                <div slot="header">
                  <h2 class="text-xl font-semibold text-gray-800">Cards</h2>
                  <p class="text-sm text-gray-600">Container components with different variants</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <hc-card variant="default">
                    <h4 class="font-medium text-gray-900">Default Card</h4>
                    <p class="mt-2 text-sm text-gray-600">This is a default card with subtle shadow.</p>
                  </hc-card>

                  <hc-card variant="elevated">
                    <h4 class="font-medium text-gray-900">Elevated Card</h4>
                    <p class="mt-2 text-sm text-gray-600">This card has more prominent shadow.</p>
                  </hc-card>

                  <hc-card variant="outline">
                    <h4 class="font-medium text-gray-900">Outline Card</h4>
                    <p class="mt-2 text-sm text-gray-600">This card uses border instead of shadow.</p>
                  </hc-card>
                </div>

                <div class="mt-6">
                  <hc-card [hasHeader]="true" [hasFooter]="true" variant="elevated">
                    <div slot="header">
                      <h4 class="font-medium text-gray-900">Card with Header & Footer</h4>
                    </div>
                    
                    <p class="text-gray-600">
                      This card demonstrates the header and footer slots in action. 
                      The content area is automatically padded correctly.
                    </p>
                    
                    <div slot="footer">
                      <div class="flex justify-end space-x-3">
                        <hc-button variant="ghost" size="sm">Cancel</hc-button>
                        <hc-button variant="primary" size="sm">Save</hc-button>
                      </div>
                    </div>
                  </hc-card>
                </div>
              </hc-card>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class HeadcountUiDemoComponent {
  // Demo pages configuration
  protected readonly demoPages: DemoPage[] = [
    {
      id: 'page1',
      title: 'Core Components',
      description: 'Buttons, Inputs, Cards, Badges',
      badge: 'Complete'
    },
    {
      id: 'page2',
      title: 'Form Controls',
      description: 'Selects, Toggles, Checkboxes, Radios',
      badge: 'Complete'
    },
    {
      id: 'page3',
      title: 'Advanced UI',
      description: 'Textarea, Slider, Progress, Tabs',
      badge: 'New'
    }
  ];

  // Current page state
  protected readonly currentPage = signal<string>('page1');

  // Navigation methods
  protected onPageSelect(pageId: string): void {
    this.currentPage.set(pageId);
  }
}
