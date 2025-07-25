import { Component, signal } from '@angular/core';
import { HcSelect, SelectOption } from '../shared/lib/components/select/select.component';
import { HcToggle } from '../shared/lib/components/toggle/toggle.component';
import { HcCheckbox } from '../shared/lib/components/checkbox/checkbox.component';
import { HcRadioGroup, RadioOption } from '../shared/lib/components/radio/radio.component';
import { HcCard } from '../shared/lib/components/card/card.component';
import { HcButton } from '../shared/lib/components/button/button.component';
import { HcBadge } from '../shared/lib/components/badge/badge.component';

/**
 * Demo component for Phase 2 components: Form Controls
 */
@Component({
  selector: 'app-demo-page-2',
  imports: [HcSelect, HcToggle, HcCheckbox, HcRadioGroup, HcCard, HcButton, HcBadge],
  template: `
    <div class="space-y-12">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Form Controls</h1>
        <p class="mt-2 text-lg text-gray-600">Advanced form components with validation and states</p>
      </header>

      <!-- Select Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Select Dropdowns</h2>
          <p class="text-sm text-gray-600">Dropdown selects with search and multi-selection</p>
        </div>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Select -->
            <hc-select 
              label="Country" 
              placeholder="Select a country..."
              [options]="countryOptions"
              helpText="Choose your country of residence"
              (valueChange)="onCountryChange($event)">
            </hc-select>

            <!-- Searchable Select -->
            <hc-select 
              label="Programming Language" 
              placeholder="Search languages..."
              [options]="languageOptions"
              [searchable]="true"
              helpText="Type to search through options"
              (valueChange)="onLanguageChange($event)">
            </hc-select>

            <!-- Multi-Select -->
            <hc-select 
              label="Skills" 
              placeholder="Select multiple skills..."
              [options]="skillOptions"
              [multiple]="true"
              [searchable]="true"
              helpText="Select all that apply"
              (valueChange)="onSkillsChange($event)">
            </hc-select>

            <!-- Error State -->
            <hc-select 
              label="Required Field" 
              placeholder="This field has an error..."
              [options]="countryOptions"
              [required]="true"
              errorMessage="Please select a valid option">
            </hc-select>
          </div>

          <!-- Display Selected Values -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Values:</h4>
            <div class="space-y-1 text-sm text-gray-600">
              <div>Country: {{ selectedCountry() || 'None' }}</div>
              <div>Language: {{ selectedLanguage() || 'None' }}</div>
              <div>Skills: {{ selectedSkills().length > 0 ? selectedSkills().join(', ') : 'None' }}</div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Select Sizes</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <hc-select 
                size="sm" 
                placeholder="Small select..."
                [options]="basicOptions">
              </hc-select>
              <hc-select 
                size="md" 
                placeholder="Medium select..."
                [options]="basicOptions">
              </hc-select>
              <hc-select 
                size="lg" 
                placeholder="Large select..."
                [options]="basicOptions">
              </hc-select>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Toggle Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Toggle Switches</h2>
          <p class="text-sm text-gray-600">On/off switches with different variants and sizes</p>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Basic Toggles</h3>
            <div class="space-y-3">
              <hc-toggle label="Enable notifications"></hc-toggle>
              <hc-toggle label="Auto-save documents" helpText="Automatically save your work every 30 seconds"></hc-toggle>
              <hc-toggle label="Dark mode" [disabled]="true"></hc-toggle>
              <hc-toggle label="Required setting" [required]="true" errorMessage="This setting must be enabled"></hc-toggle>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Toggle Variants</h3>
            <div class="space-y-3">
              <hc-toggle variant="default" label="Default"></hc-toggle>
              <hc-toggle variant="success" label="Success"></hc-toggle>
              <hc-toggle variant="warning" label="Warning"></hc-toggle>
              <hc-toggle variant="error" label="Error"></hc-toggle>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Toggle Sizes</h3>
            <div class="flex items-center space-x-6">
              <hc-toggle size="sm" label="Small"></hc-toggle>
              <hc-toggle size="md" label="Medium"></hc-toggle>
              <hc-toggle size="lg" label="Large"></hc-toggle>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Checkbox Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Checkboxes</h2>
          <p class="text-sm text-gray-600">Multi-selection checkboxes with variants</p>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Basic Checkboxes</h3>
            <div class="space-y-3">
              <hc-checkbox label="I agree to the terms and conditions"></hc-checkbox>
              <hc-checkbox label="Subscribe to newsletter" helpText="Get weekly updates about new features"></hc-checkbox>
              <hc-checkbox label="Remember me" [disabled]="true"></hc-checkbox>
              <hc-checkbox label="Required field" [required]="true" errorMessage="This field is required"></hc-checkbox>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Checkbox Variants</h3>
            <div class="space-y-3">
              <hc-checkbox variant="default" label="Default"></hc-checkbox>
              <hc-checkbox variant="success" label="Success"></hc-checkbox>
              <hc-checkbox variant="warning" label="Warning"></hc-checkbox>
              <hc-checkbox variant="error" label="Error"></hc-checkbox>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Checkbox Sizes</h3>
            <div class="flex items-center space-x-6">
              <hc-checkbox size="sm" label="Small"></hc-checkbox>
              <hc-checkbox size="md" label="Medium"></hc-checkbox>
              <hc-checkbox size="lg" label="Large"></hc-checkbox>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Radio Group Component Showcase -->
      <hc-card [hasHeader]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Radio Groups</h2>
          <p class="text-sm text-gray-600">Single-selection radio button groups</p>
        </div>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vertical Radio Group -->
            <hc-radio-group 
              label="Preferred Contact Method"
              [options]="contactOptions"
              helpText="How would you like us to contact you?">
            </hc-radio-group>

            <!-- Horizontal Radio Group -->
            <hc-radio-group 
              label="Account Type"
              [options]="accountOptions"
              orientation="horizontal"
              helpText="Choose your account type">
            </hc-radio-group>

            <!-- Radio Group with Error -->
            <hc-radio-group 
              label="Required Selection"
              [options]="basicRadioOptions"
              [required]="true"
              errorMessage="Please select an option">
            </hc-radio-group>

            <!-- Radio Group with Disabled Option -->
            <hc-radio-group 
              label="Subscription Plan"
              [options]="planOptions"
              helpText="Some plans may not be available">
            </hc-radio-group>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Radio Variants</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <hc-radio-group variant="default" [options]="variantOptions"></hc-radio-group>
              <hc-radio-group variant="success" [options]="variantOptions"></hc-radio-group>
              <hc-radio-group variant="warning" [options]="variantOptions"></hc-radio-group>
              <hc-radio-group variant="error" [options]="variantOptions"></hc-radio-group>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Radio Sizes</h3>
            <div class="flex space-x-8">
              <hc-radio-group size="sm" label="Small" [options]="sizeOptions"></hc-radio-group>
              <hc-radio-group size="md" label="Medium" [options]="sizeOptions"></hc-radio-group>
              <hc-radio-group size="lg" label="Large" [options]="sizeOptions"></hc-radio-group>
            </div>
          </div>
        </div>
      </hc-card>

      <!-- Form Example -->
      <hc-card [hasHeader]="true" [hasFooter]="true">
        <div slot="header">
          <h2 class="text-xl font-semibold text-gray-800">Complete Form Example</h2>
          <p class="text-sm text-gray-600">All form components working together</p>
        </div>
        
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <hc-select 
              label="Country" 
              [options]="countryOptions"
              [required]="true">
            </hc-select>

            <hc-select 
              label="Preferred Languages" 
              [options]="languageOptions"
              [multiple]="true"
              [searchable]="true">
            </hc-select>
          </div>

          <hc-radio-group 
            label="Experience Level"
            [options]="experienceOptions"
            orientation="horizontal"
            [required]="true">
          </hc-radio-group>

          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-700">Preferences</h3>
            <hc-checkbox label="Send me product updates"></hc-checkbox>
            <hc-checkbox label="Allow marketing communications"></hc-checkbox>
            <hc-toggle label="Enable two-factor authentication"></hc-toggle>
            <hc-toggle label="Auto-save preferences"></hc-toggle>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <hc-badge variant="info">Form components showcase</hc-badge>
            <div class="space-x-3">
              <hc-button variant="ghost">Cancel</hc-button>
              <hc-button variant="primary">Save Preferences</hc-button>
            </div>
          </div>
        </form>

        <div slot="footer" class="text-center text-sm text-gray-500">
          This form demonstrates all form components working together with proper spacing and alignment.
        </div>
      </hc-card>
    </div>
  `,
})
export class DemoPage2Component {
  // Select Options
  protected readonly countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'au', label: 'Australia' },
    { value: 'jp', label: 'Japan' }
  ];

  protected readonly languageOptions: SelectOption[] = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' }
  ];

  protected readonly skillOptions: SelectOption[] = [
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'fullstack', label: 'Full Stack Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'devops', label: 'DevOps' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'data', label: 'Data Science' },
    { value: 'ml', label: 'Machine Learning' }
  ];

  protected readonly basicOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  // Radio Options
  protected readonly contactOptions: RadioOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' },
    { value: 'none', label: 'Do not contact' }
  ];

  protected readonly accountOptions: RadioOption[] = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  protected readonly basicRadioOptions: RadioOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'maybe', label: 'Maybe' }
  ];

  protected readonly planOptions: RadioOption[] = [
    { value: 'free', label: 'Free Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan', disabled: true }
  ];

  protected readonly variantOptions: RadioOption[] = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ];

  protected readonly sizeOptions: RadioOption[] = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' }
  ];

  protected readonly experienceOptions: RadioOption[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  // State for tracking selected values
  protected readonly selectedCountry = signal<string>('');
  protected readonly selectedLanguage = signal<string>('');
  protected readonly selectedSkills = signal<string[]>([]);

  // Event handlers
  protected onCountryChange(value: any): void {
    this.selectedCountry.set(typeof value === 'string' ? value : '');
  }

  protected onLanguageChange(value: any): void {
    this.selectedLanguage.set(typeof value === 'string' ? value : '');
  }

  protected onSkillsChange(value: any): void {
    this.selectedSkills.set(Array.isArray(value) ? value : []);
  }
}
