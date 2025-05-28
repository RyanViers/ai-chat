export interface Conversation {
  id: string;
  owner: string; 
  aiModel: string; 
  title?: string;
  createdAt?: number; 
  updatedAt?: number;
}

export interface Message {
  id?: string;
  conversationId: string;
  text: string;
  sender: 'user' | string; 
  timestamp: number; 
  status?: 'sending' | 'sent' | 'error';
  owner?: string; 
}