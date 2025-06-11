import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "chat-header",
  template: `
    <!-- Header -->
    <header class="px-4 py-3 bg-slate-700 text-white text-lg font-semibold shadow-sm flex items-center justify-between">
      <span>AI Chat</span>
      <button 
        (click)="navigateToShowcase()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <span>🎨</span>
        <span>UI Showcase</span>
      </button>
    </header>
  `,
})
export class ChatHeaderComponent {
  constructor(private router: Router) {}
  
  navigateToShowcase(): void {
    this.router.navigate(['/showcase']);
  }
}