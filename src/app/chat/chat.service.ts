import { Injectable, signal } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { createMessage, updateMessage } from '../../graphql/mutations';
import { listMessages } from '../../graphql/queries';
import { onCreateMessage, onUpdateMessage } from '../../graphql/subscriptions';
import { type CreateMessageInput, type UpdateMessageInput, MessageStatus } from '../../API';
import { Message } from "./models";

@Injectable()
export class ChatService {
  private client = generateClient();

  // State signals
  message = signal('');
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.initializeMessages();
    this.setupSubscriptions();
  }

  private async initializeMessages() {
    try {
      this.isLoading.set(true);
      const result = await this.client.graphql({
        query: listMessages,
        variables: {
          limit: 50
        }
      });

      const messages = result.data?.listMessages?.items || [];
      this.messages.set(messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender as 'user' | 'ai',
        timestamp: new Date(msg.timestamp).getTime(),
        status: (msg.status || MessageStatus.sent) as MessageStatus,
        conversationId: msg.conversationId
      })));
    } catch (err) {
      this.error.set('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  private setupSubscriptions() {
    // Subscribe to new messages
    this.client.graphql({
      query: onCreateMessage
    }).subscribe({
      next: ({ data }) => {
        const newMessage = data.onCreateMessage;
        if (newMessage) {
          this.messages.update(msgs => [{
            id: newMessage.id,
            text: newMessage.text,
            sender: newMessage.sender as 'user' | 'ai',
            timestamp: new Date(newMessage.timestamp).getTime(),
            status: (newMessage.status || MessageStatus.sent) as MessageStatus,
            conversationId: newMessage.conversationId
          }, ...msgs]);
        }
      },
      error: (error) => console.error('Subscription error:', error)
    });

    // Subscribe to message updates
    this.client.graphql({
      query: onUpdateMessage
    }).subscribe({
      next: ({ data }) => {
        const updatedMessage = data.onUpdateMessage;
        if (updatedMessage) {
          this.messages.update(msgs => 
            msgs.map(msg => 
              msg.id === updatedMessage.id 
                ? { 
                    ...msg, 
                    ...updatedMessage, 
                    sender: updatedMessage.sender as 'user' | 'ai',
                    timestamp: new Date(updatedMessage.timestamp).getTime(),
                    status: (updatedMessage.status || MessageStatus.sent) as MessageStatus
                  }
                : msg
            )
          );
        }
      },
      error: (error) => console.error('Subscription error:', error)
    });
  }

  async sendMessage() {
    const text = this.message().trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}`;
    const input: CreateMessageInput = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: MessageStatus.sending,
      conversationId: 'default-conversation-id'
    };

    // Optimistically add message
    this.messages.update(msgs => [{
      id: tempId,
      text,
      sender: 'user',
      timestamp: Date.now(),
      status: MessageStatus.sending,
      conversationId: input.conversationId
    }, ...msgs]);

    try {
      const result = await this.client.graphql({
        query: createMessage,
        variables: { input },
      });

      const created = result.data?.createMessage;
      if (created) {
        // Update the temporary message with the real one
        this.messages.update(msgs => 
          msgs.map(msg => 
            msg.id === tempId 
              ? {
                  id: created.id,
                  text: created.text,
                  sender: created.sender as 'user' | 'ai',
                  timestamp: new Date(created.timestamp).getTime(),
                  status: MessageStatus.sent,
                  conversationId: created.conversationId
                }
              : msg
          )
        );
      }

      this.message.set('');
      this.error.set(null);
    } catch (err) {
      // Update message status to error
      this.messages.update(msgs => 
        msgs.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: MessageStatus.error }
            : msg
        )
      );
      this.error.set('Failed to send message');
      console.error('Error sending message:', err);
    }
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async retryMessage(messageId: string) {
    const message = this.messages().find(m => m.id === messageId);
    if (!message) return;

    this.messages.update(msgs => 
      msgs.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: MessageStatus.sending }
          : msg
      )
    );

    try {
      const input: UpdateMessageInput = {
        id: messageId,
        status: MessageStatus.sending
      };

      await this.client.graphql({
        query: updateMessage,
        variables: { input }
      });

      this.error.set(null);
    } catch (err) {
      this.messages.update(msgs => 
        msgs.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: MessageStatus.error }
            : msg
        )
      );
      this.error.set('Failed to retry message');
      console.error('Error retrying message:', err);
    }
  }
}