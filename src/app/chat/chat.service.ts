import { Injectable, signal } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { createMessage } from '../../graphql/mutations';
import type { CreateMessageInput } from '../../API'; 
import { Message } from "./models";

@Injectable()
export class ChatService {
  
  private client = generateClient(); // Initialize your GraphQL client here

  message = signal('');
  messages = signal<Message[]>([
    { text: 'Welcome to your chat assistant.', sender: 'ai', timestamp: Date.now() },
  ]);

  async sendMessage() {
    const text = this.message().trim();
    if (!text) return;
  
    const input: CreateMessageInput = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString(), // AWSDateTime is ISO format
    };
  
    try {
      const result = await this.client.graphql({
        query: createMessage,
        variables: { input },
      });
  
      console.log('GraphQL response:', result);

      const created = result.data?.createMessage;
  
      if (created) {
        this.messages.update((msgs) => [
          ...msgs,
          {
            id: created.id,
            text: created.text,
            sender: created.sender as 'user' | 'ai',
            timestamp: new Date(created.timestamp).getTime(),
          },
        ]);
      }
  
      this.message.set('');
    } catch (err) {
      console.error(err);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault(); // prevents full page reload
    this.sendMessage();
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}