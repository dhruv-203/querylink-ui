// Types
export interface ChatMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}

// In-memory data store for demo purposes
let chatHistories: ChatHistory[] = [
  {
    id: "chat-1",
    title: "First Conversation",
    lastMessage: "What can you help me with?",
    timestamp: Date.now(),
  },
  {
    id: "chat-2",
    title: "Data Analysis",
    lastMessage: "Can you analyze this dataset?",
    timestamp: Date.now() - 1000 * 60 * 60,
  },
];

const chatMessages: Record<string, ChatMessage[]> = {
  "chat-1": [
    {
      id: "msg-1",
      chatId: "chat-1",
      role: "user",
      content: "What can you help me with?",
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: "msg-2",
      chatId: "chat-1",
      role: "assistant",
      content:
        "I can help you analyze your data, answer questions, and provide insights based on the information you provide. Just upload your data or ask me a question to get started!",
      timestamp: Date.now() - 1000 * 60 * 4,
    },
  ],
  "chat-2": [
    {
      id: "msg-3",
      chatId: "chat-2",
      role: "user",
      content: "Can you analyze this dataset?",
      timestamp: Date.now() - 1000 * 60 * 60,
    },
    {
      id: "msg-4",
      chatId: "chat-2",
      role: "assistant",
      content:
        "Of course! Please upload your dataset and I'll analyze it for you.",
      timestamp: Date.now() - 1000 * 60 * 59,
    },
  ],
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const fetchChatHistory = async (): Promise<ChatHistory[]> => {
  await delay(500); // Simulate API delay
  return [...chatHistories].sort((a, b) => b.timestamp - a.timestamp);
};

export const fetchChatById = async (chatId: string): Promise<ChatMessage[]> => {
  await delay(300); // Simulate API delay

  const messages = chatMessages[chatId];
  if (!messages) {
    throw new Error(`Chat with ID ${chatId} not found`);
  }

  return [...messages].sort((a, b) => a.timestamp - b.timestamp);
};

export const sendMessage = async (
  chatId: string | null,
  content: string
): Promise<{ chatId: string }> => {
  await delay(500); // Simulate API delay

  let currentChatId = chatId;

  // If it's a new chat, create a new chat history entry
  if (!currentChatId) {
    currentChatId = `chat-${Date.now()}`;
    const newChatHistory: ChatHistory = {
      id: currentChatId,
      title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
      lastMessage: content,
      timestamp: Date.now(),
    };

    chatHistories.push(newChatHistory);
    chatMessages[currentChatId] = [];
  }

  // Add user message
  const userMessage: ChatMessage = {
    id: `msg-${Date.now()}-1`,
    chatId: currentChatId,
    role: "user",
    content,
    timestamp: Date.now(),
  };

  // Add assistant response
  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now()}-2`,
    chatId: currentChatId,
    role: "assistant",
    content:
      "I've received your message and I'm processing it. Here's what I can tell you: This is a simulated response for demonstration purposes. In a real application, this would be an actual response from the AI model based on your input.",
    timestamp: Date.now() + 100,
  };

  // Update chat messages
  if (!chatMessages[currentChatId]) {
    chatMessages[currentChatId] = [];
  }

  chatMessages[currentChatId].push(userMessage);
  chatMessages[currentChatId].push(assistantMessage);

  // Update chat history
  const chatHistoryIndex = chatHistories.findIndex(
    (ch) => ch.id === currentChatId
  );
  if (chatHistoryIndex !== -1) {
    chatHistories[chatHistoryIndex].lastMessage = content;
    chatHistories[chatHistoryIndex].timestamp = Date.now();
  }

  return { chatId: currentChatId };
};

export const deleteChatHistory = async (chatId: string): Promise<void> => {
  await delay(300); // Simulate API delay

  chatHistories = chatHistories.filter((ch) => ch.id !== chatId);
  delete chatMessages[chatId];
};

export const renameChatHistory = async (
  chatId: string,
  newTitle: string
): Promise<ChatHistory> => {
  await delay(300); // Simulate API delay

  const chatHistoryIndex = chatHistories.findIndex((ch) => ch.id === chatId);
  if (chatHistoryIndex === -1) {
    throw new Error(`Chat with ID ${chatId} not found`);
  }

  chatHistories[chatHistoryIndex].title = newTitle;

  return chatHistories[chatHistoryIndex];
};

export const uploadCSV = async (
  file: File
): Promise<{ success: boolean; message: string }> => {
  await delay(1000); // Simulate upload time

  // This is a mock function - no actual file upload happens
  return {
    success: true,
    message: `Successfully uploaded and processed ${file.name}`,
  };
};

export const uploadText = async (
  text: string
): Promise<{ success: boolean; message: string }> => {
  await delay(800); // Simulate processing time

  // This is a mock function - no actual text processing happens
  return {
    success: true,
    message: `Successfully processed ${text.length} characters of text`,
  };
};
