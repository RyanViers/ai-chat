import { Component, inject } from "@angular/core";
import { ScrollToBottomDirective } from '../../shared/directives/scrollToBottom.directive';
import { ChatService } from "../chat.service";

@Component({
  selector: "chat-main",
  imports: [ScrollToBottomDirective],
  host: {
    class: "flex flex-col flex-1 min-h-0 size-full",
  },
  template: `
    <main
      class="flex-1 min-h-0 overflow-y-auto px-6 py-4 flex flex-col gap-4"
      scrollToBottom
      [scrollToBottom]="service.messages()">
      @if (service.isLoading()) {
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }
      @if (service.error()) {
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
          {{ service.error() }}
        </div>
      }
      @for (msg of service.messages(); track msg.id) {
        <div [class]="msg.sender === 'user' ? 'self-end' : 'self-start'">
          <div
            [class]="
              (msg.sender === 'user'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-gray-100') +
              ' px-4 py-2 rounded-2xl shadow-sm break-words whitespace-pre-wrap max-w-[75%] w-fit relative group'
            "
          >
            {{ msg.text }}
            @if (msg.status === 'sending') {
              <div class="absolute -right-6 top-1/2 -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            }
            @if (msg.status === 'error') {
              <button 
                (click)="service.retryMessage(msg.id!)"
                class="absolute -right-6 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </button>
            }
          </div>
          <div class="text-xs mt-1 text-gray-400">
            {{ service.formatTime(msg.timestamp) }}
          </div>
        </div>
      }
    </main>
  `,
})
export class ChatMainComponent {
  protected service = inject(ChatService);
}