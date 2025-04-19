import { Component } from "@angular/core";

@Component({
  selector: "chat-aside",
  template: `
     <!-- Sidebar -->
     <aside class="size-full bg-slate-800 border-r border-slate-700 flex flex-col">
        <div class="p-4 flex items-center gap-3 border-b border-slate-700">
          <img src="https://i.pravatar.cc/40" alt="Avatar" class="w-10 h-10 rounded-full" />
          <div>
            <p class="text-sm font-medium">Your Name</p>
            <a href="#" class="text-xs text-blue-400 hover:underline">View Profile</a>
          </div>
        </div>
        <nav class="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
          <div class="hover:bg-slate-700 p-2 rounded cursor-pointer">🗨️ Chat with AI</div>
          <div class="hover:bg-slate-700 p-2 rounded cursor-pointer">➕ New Chat</div>
        </nav>
        <div class="p-4 border-t border-slate-700 text-xs text-gray-400">
          <button class="hover:text-white">Settings</button>
        </div>
      </aside>
  `,
})
export class ChatAsideComponent {}