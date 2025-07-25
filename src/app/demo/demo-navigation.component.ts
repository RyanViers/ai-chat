import { Component, computed, input, output } from '@angular/core';

export interface DemoPage {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

@Component({
  selector: 'app-demo-navigation',
  imports: [],
  template: `
    <div class="bg-white border-r border-gray-200 w-64 flex-shrink-0">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Component Library</h2>
        <p class="text-sm text-gray-600 mt-1">Angular 20 + TailwindUI</p>
      </div>
      
      <nav class="p-4 space-y-1">
        @for (page of pages(); track page.id) {
          <button
            class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-between group"
            [class.bg-blue-50]="page.id === activePage()"
            [class.text-blue-700]="page.id === activePage()"
            [class.text-gray-700]="page.id !== activePage()"
            [class.hover:bg-gray-50]="page.id !== activePage()"
            (click)="onPageSelect(page.id)">
            
            <div class="flex-1">
              <div class="font-medium">{{ page.title }}</div>
              <div class="text-xs opacity-75 mt-0.5">{{ page.description }}</div>
            </div>
            
            @if (page.badge) {
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ page.badge }}
              </span>
            }
          </button>
        }
      </nav>
    </div>
  `,
})
export class DemoNavigationComponent {
  public readonly pages = input<DemoPage[]>([]);
  public readonly activePage = input<string>('');
  
  public readonly pageSelect = output<string>();

  protected onPageSelect(pageId: string): void {
    this.pageSelect.emit(pageId);
  }
}
