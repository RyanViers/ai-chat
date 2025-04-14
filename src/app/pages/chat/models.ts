export interface Message {
  text: string;
  sender: 'user' | 'ai'; // ✅ literal union
  timestamp: number;
  id?: string;
}