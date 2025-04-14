import { Component, inject } from "@angular/core";
import { ChatService } from "./../chat.service";

@Component({
  selector: "chat-input",
  template: `
    <div class="p-4 border-t border-slate-700 flex gap-2 bg-slate-800">
      <input
        [value]="service.message()"
        (input)="service.message.set($any($event.target).value)"
        (keydown.enter)="service.sendMessage()"
        name="message"
        autocomplete="off"
        class="flex-1 px-4 py-2 rounded-xl border border-slate-600 bg-slate-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-secondary)]"
        placeholder="Type a message..."
      />
      <button
        type="button"
        (click)="service.sendMessage()"
        class="px-4 py-2 rounded-xl bg-red-500 text-white hover:opacity-80 transition"
      >
        Send
      </button>
    </div>
  `,
})
export class ChatInputComponent {
  protected service = inject(ChatService);
}