
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ChatMessage from "./ChatMessage";
import { fetchChatById, ChatMessage as MessageType } from "@/lib/api";

interface ChatHistoryProps {
  chatId: string | null;
  onChatLoaded?: (title: string) => void;
  chatUpdated: number; // This will trigger a re-fetch when incremented
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatId, onChatLoaded, chatUpdated }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || chatId === "new") {
        setMessages([]);
        return;
      }

      setIsLoading(true);

      try {
        const fetchedMessages = await fetchChatById(chatId);
        setMessages(fetchedMessages);

        // Set title if callback is provided and there are messages
        if (onChatLoaded && fetchedMessages.length > 0) {
          const firstUserMessage = fetchedMessages.find(msg => msg.role === "user");
          if (firstUserMessage) {
            const title = firstUserMessage.content.length > 30 
              ? `${firstUserMessage.content.substring(0, 30)}...` 
              : firstUserMessage.content;
            onChatLoaded(title);
          }
        }
      } catch (error) {
        toast.error("Failed to load chat messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, chatUpdated, onChatLoaded]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading chat history...</p>
        </div>
      </div>
    );
  }

  if (!chatId || (chatId === "new" && messages.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-2">Start a new conversation</h2>
          <p className="text-muted-foreground mb-6">
            Ask a question or provide details about what you'd like to discuss.
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-semibold mb-2">No messages found</h2>
          <p className="text-muted-foreground">
            This conversation appears to be empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;
