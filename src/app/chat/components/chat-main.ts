import { Component, inject } from "@angular/core";
import { ScrollToBottomDirective } from '../../directives/scrollToBottom.directive';
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
      @for (msg of service.messages(); track msg) {
        <div [class]="msg.sender === 'user' ? 'self-end' : 'self-start'">
          <div
            [class]="
              (msg.sender === 'user'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-gray-100') +
              ' px-4 py-2 rounded-2xl shadow-sm break-words whitespace-pre-wrap max-w-[75%] w-fit'
            "
          >
            {{ msg.text }}
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