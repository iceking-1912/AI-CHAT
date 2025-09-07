import { IconName } from './components/Icon';

export interface Tag {
  id: string;
  name: string;
  icon: IconName;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  tags: Tag[];
  knowledgeAreas: Tag[];
  modelId?: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  chats: Chat[];
  personas: Tag[];
}

export interface AIModel {
    id: string;
    name: string;
    provider: 'google' | 'ollama';
}