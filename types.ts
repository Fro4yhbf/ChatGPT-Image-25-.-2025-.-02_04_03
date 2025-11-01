
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  content: string; // For text files, this will hold the content
  file: File;
}

export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  text: string;
}
