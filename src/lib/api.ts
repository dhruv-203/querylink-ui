import { toast } from "@/components/ui/sonner";

// Types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockChatHistory: ChatHistory[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `chat-${i + 1}`,
  title: `Chat ${i + 1} ${i % 3 === 0 ? 'about machine learning' : i % 3 === 1 ? 'regarding data analysis' : 'on natural language processing'}`,
  lastMessage: `Last message from chat ${i + 1}`,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
}));

const mockChats: Record<string, ChatMessage[]> = {};

// Initialize some mock conversations
mockChatHistory.forEach((history) => {
  const numMessages = Math.floor(Math.random() * 10) + 2;
  const messages: ChatMessage[] = [];
  
  for (let i = 0; i < numMessages; i++) {
    const isUserMessage = i % 2 === 0;
    messages.push({
      id: `msg-${history.id}-${i}`,
      content: isUserMessage 
        ? `User question ${Math.floor(i/2) + 1} for chat ${history.id}?`
        : `This is a detailed response to question ${Math.floor(i/2) + 1} in chat ${history.id}.`,
      role: isUserMessage ? 'user' : 'assistant',
      createdAt: new Date(Date.now() - (numMessages - i) * 60 * 1000).toISOString(),
    });
  }
  
  mockChats[history.id] = messages;
});

// API functions with simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchChatHistory = async (): Promise<ChatHistory[]> => {
  await delay(800);
  return [...mockChatHistory];
};

export const fetchChatById = async (chatId: string): Promise<ChatMessage[]> => {
  await delay(600);
  return mockChats[chatId] || [];
};

export const sendMessage = async (chatId: string | null, message: string): Promise<{ chatId: string, message: ChatMessage }> => {
  await delay(500);
  
  const newChatId = chatId || `chat-${Date.now()}`;
  const userMessage: ChatMessage = {
    id: `msg-${newChatId}-${Date.now()}`,
    content: message,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  
  if (!mockChats[newChatId]) {
    mockChats[newChatId] = [];
    
    // Create new chat history entry
    const newHistoryEntry: ChatHistory = {
      id: newChatId,
      title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
      lastMessage: message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockChatHistory.unshift(newHistoryEntry);
  }
  
  mockChats[newChatId].push(userMessage);
  
  // Simulate AI response
  await delay(1000);
  
  const aiResponse: ChatMessage = {
    id: `msg-${newChatId}-${Date.now() + 1}`,
    content: `This is a response to: "${message}"`,
    role: 'assistant',
    createdAt: new Date().toISOString(),
  };
  
  mockChats[newChatId].push(aiResponse);
  
  // Update chat history
  const historyIndex = mockChatHistory.findIndex(h => h.id === newChatId);
  if (historyIndex !== -1) {
    mockChatHistory[historyIndex].lastMessage = aiResponse.content;
    mockChatHistory[historyIndex].updatedAt = new Date().toISOString();
  }
  
  return { chatId: newChatId, message: userMessage };
};

export const renameChatHistory = async (chatId: string, newTitle: string): Promise<ChatHistory> => {
  await delay(300);
  
  const historyIndex = mockChatHistory.findIndex(h => h.id === chatId);
  if (historyIndex === -1) throw new Error('Chat not found');
  
  mockChatHistory[historyIndex].title = newTitle;
  mockChatHistory[historyIndex].updatedAt = new Date().toISOString();
  
  return mockChatHistory[historyIndex];
};

export const deleteChatHistory = async (chatId: string): Promise<void> => {
  await delay(300);
  
  const historyIndex = mockChatHistory.findIndex(h => h.id === chatId);
  if (historyIndex === -1) throw new Error('Chat not found');
  
  mockChatHistory.splice(historyIndex, 1);
  delete mockChats[chatId];
};

export const uploadCSV = async (file: File): Promise<{ success: boolean; message: string }> => {
  await delay(1500);
  
  // Simulate success (90% of the time) or failure
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return { success: true, message: `File "${file.name}" uploaded successfully!` };
  } else {
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const uploadTextData = async (text: string): Promise<{ success: boolean; message: string }> => {
  await delay(1200);
  
  // Simulate success (90% of the time) or failure
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return { success: true, message: 'Text data uploaded successfully!' };
  } else {
    throw new Error('Failed to upload text data. Please try again.');
  }
};
