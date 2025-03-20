
import React, { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "@/lib/api";

interface ChatInputProps {
  chatId: string | null;
  onMessageSent: (chatId: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatId, onMessageSent, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { chatId: newChatId } = await sendMessage(chatId, message);
      setMessage("");
      onMessageSent(newChatId);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    navigate("/ask-query/new");
  };

  if (disabled) {
    return (
      <div className="border-t px-4 py-4 glass-effect sticky bottom-0 z-10">
        <div className="container max-w-4xl flex gap-4 items-center">
          <Button onClick={handleNewChat} className="w-full flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t px-4 py-4 glass-effect sticky bottom-0 z-10">
      <div className="container max-w-4xl">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none pr-12 max-h-32 py-3 shadow-subtle bg-white dark:bg-gray-900 border-muted"
            disabled={isSubmitting}
            rows={1}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-1.5 h-8 w-8"
            onClick={handleSendMessage}
            disabled={!message.trim() || isSubmitting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          AI may produce inaccurate information. Press Enter to send.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
