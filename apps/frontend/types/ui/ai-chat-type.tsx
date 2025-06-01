export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

export interface AiChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SuggestedQuestion {
  title: string;
  question: string;
  icon: React.ReactNode;
  gradient: string;
}
