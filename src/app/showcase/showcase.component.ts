import { Component, signal } from '@angular/core';
import { ButtonPreviewComponent } from './components/button-showcase';
import { MenubarPreviewComponent } from './components/menu-showcase';

@Component({
  selector: 'app-showcase',
  imports: [ButtonPreviewComponent, MenubarPreviewComponent],
  template: `
    <div class="flex h-screen bg-background">
      <!-- Sidebar Navigation -->
      <div class="w-80 bg-card border-r border-border shadow-sm">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="p-6 border-b border-border">
            <div class="flex items-center justify-between mb-2">
              <h1 class="text-2xl font-bold text-foreground">Spartan UI</h1>
              <button 
                (click)="toggleDarkMode()"
                class="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                @if (isDarkMode()) {
                  <span class="text-xl">☀️</span>
                } @else {
                  <span class="text-xl">🌙</span>
                }
              </button>
            </div>
            <p class="text-sm text-muted-foreground">Component Showcase</p>
          </div>
            <!-- Navigation -->
          <div class="flex-1 overflow-y-auto p-4">
            <nav class="space-y-2">
              @for (item of navigationItems(); track item.key) {
                <button
                  (click)="setActiveComponent(item.key)"
                  [class]="getNavItemClasses(item.key)"
                  class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">{{ item.icon }}</span>
                    <span>{{ item.label }}</span>
                  </div>
                </button>
              }
            </nav>
          </div>          <!-- Footer -->
          <div class="p-4 border-t border-border">
            <div class="text-xs text-muted-foreground text-center">
              Build your components above
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <div class="bg-card border-b border-border px-8 py-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-foreground">{{ getActiveTitle() }}</h2>
              <p class="text-sm text-muted-foreground mt-1">{{ getActiveDescription() }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-muted-foreground">Live Preview</span>
            </div>
          </div>
        </div>
        
        <!-- Content Area -->
        <div class="flex-1 overflow-auto bg-background">
          <div class="max-w-6xl mx-auto p-8">
              <!-- Welcome State -->            
            @if (activeComponent() === 'welcome') {
              <div class="text-center py-20">
                <div class="mx-auto w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mb-6">
                  <span class="text-3xl text-primary-foreground">🎨</span>
                </div>
                <h3 class="text-3xl font-bold text-foreground mb-4">Welcome to Your Showcase</h3>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Select a component from the sidebar to start building and testing your Spartan UI components.
                  This area will display your components as you build them.
                </p>
                <div class="bg-muted border border-border rounded-lg p-6 max-w-md mx-auto">
                  <h4 class="font-medium text-foreground mb-2">Quick Start</h4>
                  <p class="text-sm text-muted-foreground">
                    Click on any navigation item to switch to that component view.
                    You'll implement each component in this main area.
                  </p>
                </div>
              </div>
            }<!-- Component Display Area -->
            @if (activeComponent() !== 'welcome') {
              <div class="space-y-8">                <!-- Button Component -->
                @if (activeComponent() === 'buttons') {
                  <spartan-button-preview />
                }
                
                <!-- Card Component -->
                @if (activeComponent() === 'menu') {
                 <spartan-menubar-preview /> 
                }<!-- Placeholder for other components -->
                @if (activeComponent() !== 'buttons') {
                  <div class="bg-card rounded-xl shadow-sm border border-border p-8">
                    <div class="border-2 border-dashed border-border rounded-lg p-12 text-center">
                      <div class="text-4xl mb-4">🚧</div>
                      <h3 class="text-lg font-medium text-foreground mb-2">{{ getActiveTitle() }} Component</h3>
                      <p class="text-muted-foreground mb-4">
                        This is where you'll build your {{ getActiveTitle() }} component.
                      </p>
                      <div class="text-sm text-muted-foreground">
                        Replace this placeholder with your actual component implementation.
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
            
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShowcaseComponent {
  activeComponent = signal('welcome');
  isDarkMode = signal(false);
  
  navigationItems = signal([
    { key: 'buttons', label: 'Buttons', icon: '🔘', description: 'Button variants and interactions' },
    { key: 'cards', label: 'Cards', icon: '🃏', description: 'Card layouts and compositions' },
    { key: 'forms', label: 'Forms', icon: '📝', description: 'Form inputs and validation' },
    { key: 'dialogs', label: 'Dialogs', icon: '💬', description: 'Modals and overlays' },
    { key: 'navigation', label: 'Navigation', icon: '🧭', description: 'Navigation components' },
    { key: 'layout', label: 'Layout', icon: '📐', description: 'Layout and spacing' },
    { key: 'data', label: 'Data Display', icon: '📊', description: 'Tables and lists' },
    { key: 'feedback', label: 'Feedback', icon: '💫', description: 'Alerts and notifications' },
    { key: 'menu', label: 'Menu', icon: '📋', description: 'Menus and dropdowns' },
  ]);
  
  setActiveComponent(key: string): void {
    this.activeComponent.set(key);
  }
  
  toggleDarkMode(): void {
    this.isDarkMode.update(mode => {
      const newMode = !mode;
      // Apply dark class to document element for proper Tailwind dark mode
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }
  
  getActiveTitle(): string {
    const item = this.navigationItems().find(item => item.key === this.activeComponent());
    return item ? item.label : 'Welcome';
  }
  
  getActiveDescription(): string {
    const item = this.navigationItems().find(item => item.key === this.activeComponent());
    return item ? item.description : 'Select a component to get started';
  }
    getNavItemClasses(key: string): string {
    return this.activeComponent() === key 
      ? 'bg-primary text-primary-foreground border border-primary' 
      : 'text-foreground hover:bg-accent hover:text-accent-foreground';
  }
}