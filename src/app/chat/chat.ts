import { Component, inject } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatAsideComponent } from './components/chat-aside';
import { ChatMainComponent } from './components/chat-main';
import { ChatHeaderComponent } from './components/chat-header';
import { ChatInputComponent } from './components/chat-input';

@Component({
  selector: 'chat-page',
  imports: [ChatAsideComponent, ChatHeaderComponent, ChatInputComponent, ChatMainComponent],
  providers: [ChatService],
  host: {
    class: 'flex size-full bg-slate-900 text-white overflow-hidden',
  },
  template: `
    
      <!-- Sidebar -->
      <chat-aside />

      <!-- Main Chat -->
      <div class="flex flex-col flex-1 min-h-0 size-full">

        <!-- Header -->
        <chat-header />

        <!-- Messages -->
        <chat-main />

        <!-- Input -->
        <chat-input />

      </div>
    
  `,
})
export class ChatComponent {
  private service = inject(ChatService);
}
