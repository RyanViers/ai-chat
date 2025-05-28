// src/app/shared/modal.component.ts
import { Component } from '@angular/core';
import { input, output } from '@angular/core';

@Component({
  selector: 'modal',
  template: `
    @if (open()) {
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
        [class.opacity-0]="!open()"
        [class.opacity-100]="open()"
      >
        <div 
          class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out"
          [class.scale-95]="!open()"
          [class.scale-100]="open()"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ title() }}</h3>
              <button 
                (click)="close.emit()" 
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="text-gray-600 dark:text-gray-300">
              <ng-content />
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  /** Visibility signal input */
  open = input.required<boolean>();

  /** Title signal input */
  title = input<string>('');

  /** Close event output */
  close = output<void>();
}