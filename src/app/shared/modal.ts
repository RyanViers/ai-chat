// src/app/shared/modal.component.ts
import { Component } from '@angular/core';
import { input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ title() }}</h3>
            <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <ng-content></ng-content>
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