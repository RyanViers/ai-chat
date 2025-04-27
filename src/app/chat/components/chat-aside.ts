import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'chat-aside',
  standalone: true,
  template: `
    <!-- Sidebar -->
    <aside class="size-full bg-slate-800 border-r border-slate-700 flex flex-col">
      <!-- Profile -->
      <div class="p-4 flex items-center gap-3 border-b border-slate-700">
        <img src="https://i.pravatar.cc/40" alt="Avatar" class="w-10 h-10 rounded-full" />
        <div>
          <p class="text-sm font-medium">Your Name</p>
          <a href="#" class="text-xs text-blue-400 hover:underline">View Profile</a>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        <div class="hover:bg-slate-700 p-2 rounded cursor-pointer">🗨️ Chat with AI</div>
        <div class="hover:bg-slate-700 p-2 rounded cursor-pointer">➕ New Chat</div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-700 flex flex-col gap-2 text-xs">
        <button class="hover:text-white text-gray-400">Settings</button>
        <button
          (click)="signOut()"
          class="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
        >
          <span class="text-base">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  `,
})
export class ChatAsideComponent {
  private auth = inject(AuthService);

  signOut() {
    this.auth.signOut().catch(console.error);
  }
}