import { Component, signal } from '@angular/core';
import { HcCard } from '../shared/lib/components/card/card.component';
import { HcButton } from '../shared/lib/components/button/button.component';
import { HcBadge } from '../shared/lib/components/badge/badge.component';
import { HcInput } from '../shared/lib/components/input/input.component';
import { HcTextarea } from '../shared/lib/components/textarea/textarea.component';
import { HcSlider } from '../shared/lib/components/slider/slider.component';
import { HcProgress } from '../shared/lib/components/progress/progress.component';
import { HcTabs, TabItem as HcTabItem } from '../shared/lib/components/tabs/tabs.component';

export interface TabItem {
  id: string;
  label: string;
  content?: string;
  disabled?: boolean;
}

/**
 * Demo component for Phase 3 components: Advanced UI Elements
 */
@Component({
  selector: 'app-demo-page-3',
  imports: [HcCard, HcButton, HcBadge, HcInput, HcTextarea, HcSlider, HcProgress, HcTabs],
  template: `
    <div class="space-y-12">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Advanced UI Components</h1>
        <p class="mt-2 text-lg text-gray-600">Textarea, sliders, progress indicators, and tabs</p>
      </header>

      <!-- Textarea Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Textarea Fields</h2>
          <p class="text-sm text-gray-600">Multi-line text inputs with resizing options</p>
        </div>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Textarea -->
            <hc-textarea 
              label="Description" 
              placeholder="Enter a detailed description..."
              helpText="Provide as much detail as possible"
              [rows]="4">
            </hc-textarea>

            <!-- Required Textarea -->
            <hc-textarea 
              label="Comments" 
              placeholder="Leave your comments..."
              [required]="true"
              [rows]="4"
              helpText="Your feedback is important to us">
            </hc-textarea>

            <!-- Error State -->
            <hc-textarea 
              label="Feedback" 
              placeholder="Tell us what went wrong..."
              [required]="true"
              errorMessage="Please provide feedback"
              [rows]="3">
            </hc-textarea>

            <!-- Auto-resize -->
            <hc-textarea 
              label="Auto-resize Text" 
              placeholder="This textarea will grow as you type..."
              [autoResize]="true"
              [minRows]="2"
              [maxRows]="8"
              helpText="Maximum 8 rows">
            </hc-textarea>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Textarea Variants</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <hc-textarea 
                resize="none" 
                placeholder="No resize allowed..."
                [rows]="3">
              </hc-textarea>
              <hc-textarea 
                resize="vertical" 
                placeholder="Vertical resize only..."
                [rows]="3">
              </hc-textarea>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Slider Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Sliders & Range Inputs</h2>
          <p class="text-sm text-gray-600">Interactive sliders for numeric value selection</p>
        </div>
        
        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Basic Slider -->
            <div>
              <hc-slider 
                label="Volume" 
                [min]="0"
                [max]="100"
                [value]="50"
                helpText="Adjust the volume level"
                (valueChange)="onVolumeChange($event)">
              </hc-slider>
              <p class="mt-2 text-sm text-gray-600">Current value: {{ volumeValue() }}</p>
            </div>

            <!-- Price Range Slider -->
            <div>
              <hc-slider 
                label="Price Range" 
                [min]="0"
                [max]="1000"
                [value]="priceRange()"
                [range]="true"
                helpText="Select your budget range"
                (valueChange)="onPriceRangeChange($event)">
              </hc-slider>
              <p class="mt-2 text-sm text-gray-600">Range: {{ '$' + priceRange()[0] }} - {{ '$' + priceRange()[1] }}</p>
            </div>

            <!-- Step Slider -->
            <div>
              <hc-slider 
                label="Rating" 
                [min]="1"
                [max]="5"
                [value]="3"
                [step]="1"
                [showSteps]="true"
                helpText="Rate from 1 to 5"
                (valueChange)="onRatingChange($event)">
              </hc-slider>
              <p class="mt-2 text-sm text-gray-600">Rating: {{ ratingValue() }} stars</p>
            </div>

            <!-- Disabled Slider -->
            <div>
              <hc-slider 
                label="Locked Setting" 
                [min]="0"
                [max]="100"
                [value]="75"
                [disabled]="true"
                helpText="This setting is locked">
              </hc-slider>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Slider Variants</h3>
            <div class="space-y-4">
              <hc-slider variant="default" label="Default" [min]="0" [max]="100" [value]="40"></hc-slider>
              <hc-slider variant="success" label="Success" [min]="0" [max]="100" [value]="60"></hc-slider>
              <hc-slider variant="warning" label="Warning" [min]="0" [max]="100" [value]="80"></hc-slider>
              <hc-slider variant="error" label="Error" [min]="0" [max]="100" [value]="20"></hc-slider>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Progress Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Progress Indicators</h2>
          <p class="text-sm text-gray-600">Progress bars and loading indicators</p>
        </div>
        
        <div class="space-y-8">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Progress Bars</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>File Upload</span>
                  <span>{{ uploadProgress() }}%</span>
                </div>
                <hc-progress [value]="uploadProgress()" variant="default"></hc-progress>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Download Complete</span>
                  <span>100%</span>
                </div>
                <hc-progress [value]="100" variant="success"></hc-progress>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Warning Level</span>
                  <span>85%</span>
                </div>
                <hc-progress [value]="85" variant="warning"></hc-progress>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Error Occurred</span>
                  <span>30%</span>
                </div>
                <hc-progress [value]="30" variant="error"></hc-progress>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Indeterminate Progress</span>
                  <span>Processing...</span>
                </div>
                <hc-progress [indeterminate]="true"></hc-progress>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Progress Sizes</h3>
            <div class="space-y-3">
              <hc-progress [value]="65" size="sm" variant="default"></hc-progress>
              <hc-progress [value]="65" size="md" variant="default"></hc-progress>
              <hc-progress [value]="65" size="lg" variant="default"></hc-progress>
            </div>
          </div>

          <div class="flex space-x-4">
            <hc-button variant="primary" (click)="startProgress()">Start Upload</hc-button>
            <hc-button variant="secondary" (click)="resetProgress()">Reset</hc-button>
          </div>
        </div>
      </hc-card>

      <!-- Tabs Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Tabs Navigation</h2>
          <p class="text-sm text-gray-600">Tabbed interfaces for content organization</p>
        </div>
        
        <div class="space-y-8">
          <!-- Basic Tabs -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Basic Tabs</h3>
            <hc-tabs [tabs]="basicTabs" (tabChange)="onTabChange($event)">
              <div slot="overview" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Project Overview</h4>
                <p class="text-gray-600">This is the overview content for your project. Here you can see general information and statistics.</p>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <hc-card class="text-center p-4">
                    <div class="text-2xl font-bold text-blue-600">156</div>
                    <div class="text-sm text-gray-500">Total Users</div>
                  </hc-card>
                  <hc-card class="text-center p-4">
                    <div class="text-2xl font-bold text-green-600">89%</div>
                    <div class="text-sm text-gray-500">Completion Rate</div>
                  </hc-card>
                  <hc-card class="text-center p-4">
                    <div class="text-2xl font-bold text-purple-600">42</div>
                    <div class="text-sm text-gray-500">Active Tasks</div>
                  </hc-card>
                </div>
              </div>

              <div slot="analytics" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h4>
                <p class="text-gray-600">Detailed analytics and performance metrics for your application.</p>
                <div class="mt-4 space-y-4">
                  <div>
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Page Views</span>
                      <span>2,847</span>
                    </div>
                    <hc-progress [value]="75" variant="success"></hc-progress>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Conversion Rate</span>
                      <span>4.2%</span>
                    </div>
                    <hc-progress [value]="42" variant="default"></hc-progress>
                  </div>
                </div>
              </div>

              <div slot="settings" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Application Settings</h4>
                <p class="text-gray-600">Configure your application preferences and options.</p>
                <div class="mt-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Email Notifications</span>
                    <hc-badge variant="success">Enabled</hc-badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Auto-save</span>
                    <hc-badge variant="default">Every 5 minutes</hc-badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Theme</span>
                    <hc-badge variant="default">Light Mode</hc-badge>
                  </div>
                </div>
              </div>
            </hc-tabs>
          </div>

          <!-- Vertical Tabs -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Vertical Tabs</h3>
            <hc-tabs [tabs]="verticalTabs" orientation="vertical" [fullWidth]="false">
              <div slot="profile" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Profile Information</h4>
                <div class="space-y-4">
                  <hc-input label="Full Name" value="John Doe"></hc-input>
                  <hc-input label="Email" value="john@example.com" type="email"></hc-input>
                  <hc-textarea label="Bio" placeholder="Tell us about yourself..." [rows]="3"></hc-textarea>
                </div>
              </div>

              <div slot="security" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Security Settings</h4>
                <div class="space-y-4">
                  <hc-input label="Current Password" type="password"></hc-input>
                  <hc-input label="New Password" type="password"></hc-input>
                  <hc-input label="Confirm Password" type="password"></hc-input>
                </div>
              </div>

              <div slot="preferences" class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">User Preferences</h4>
                <p class="text-gray-600">Customize your experience with these settings.</p>
              </div>
            </hc-tabs>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-4">Tab Variants</h3>
            <div class="space-y-6">
              <hc-tabs [tabs]="variantTabs" variant="pills"></hc-tabs>
              <hc-tabs [tabs]="variantTabs" variant="underline"></hc-tabs>
              <hc-tabs [tabs]="variantTabs" variant="bordered"></hc-tabs>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Combined Example -->
      <hc-card [hasHeader]="true" [hasFooter]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Advanced Form Example</h2>
          <p class="text-sm text-gray-600">All advanced components working together</p>
        </div>
        
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <hc-input 
              label="Project Name" 
              placeholder="Enter project name..."
              [required]="true">
            </hc-input>

            <hc-input 
              label="Budget" 
              type="number"
              placeholder="0">
            </hc-input>
          </div>

          <hc-textarea 
            label="Project Description" 
            placeholder="Describe your project in detail..."
            [autoResize]="true"
            [minRows]="3"
            [maxRows]="6">
          </hc-textarea>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Priority</label>
            <hc-slider 
              [min]="1"
              [max]="5"
              [value]="3"
              [step]="1"
              [showSteps]="true"
              helpText="1 = Low priority, 5 = High priority">
            </hc-slider>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Progress</label>
            <hc-progress [value]="currentProgress()" variant="success"></hc-progress>
            <p class="mt-1 text-xs text-gray-500">{{ currentProgress() }}% complete</p>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <hc-badge variant="info">Advanced form components</hc-badge>
            <div class="space-x-3">
              <hc-button variant="ghost">Cancel</hc-button>
              <hc-button variant="primary">Create Project</hc-button>
            </div>
          </div>
        </form>

        <div slot="footer" class="text-center text-sm text-gray-500">
          This form showcases advanced UI components with proper integration and user experience.
        </div>
      </hc-card>
    </div>
  `,
})
export class DemoPage3Component {
  // State for tracking values
  protected readonly volumeValue = signal<number>(50);
  protected readonly priceRange = signal<[number, number]>([200, 800]);
  protected readonly ratingValue = signal<number>(3);
  protected readonly uploadProgress = signal<number>(0);
  protected readonly currentProgress = signal<number>(65);
  
  // Tab configurations
  protected readonly basicTabs: HcTabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  protected readonly verticalTabs: HcTabItem[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' }
  ];

  protected readonly variantTabs: HcTabItem[] = [
    { id: 'tab1', label: 'Tab One' },
    { id: 'tab2', label: 'Tab Two' },
    { id: 'tab3', label: 'Tab Three' },
    { id: 'tab4', label: 'Disabled', disabled: true }
  ];

  // Event handlers
  protected onVolumeChange(value: number | [number, number]): void {
    if (typeof value === 'number') {
      this.volumeValue.set(value);
    }
  }

  protected onPriceRangeChange(value: number | [number, number]): void {
    if (Array.isArray(value)) {
      this.priceRange.set(value);
    }
  }

  protected onRatingChange(value: number | [number, number]): void {
    if (typeof value === 'number') {
      this.ratingValue.set(value);
    }
  }

  protected onTabChange(tabId: string): void {
    console.log('Tab changed to:', tabId);
  }

  protected startProgress(): void {
    this.uploadProgress.set(0);
    const interval = setInterval(() => {
      const current = this.uploadProgress();
      if (current >= 100) {
        clearInterval(interval);
        return;
      }
      this.uploadProgress.set(Math.min(current + 5, 100));
    }, 200);
  }

  protected resetProgress(): void {
    this.uploadProgress.set(0);
  }
}
