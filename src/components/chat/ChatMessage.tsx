
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage as MessageType } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={cn(
        "py-6 first:pt-8 animate-fade-in",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div className="container max-w-4xl flex gap-4">
        <Avatar className={cn("h-8 w-8", !isUser && "bg-primary text-primary-foreground")}>
          <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="font-medium">
            {isUser ? "You" : "Assistant"}
          </div>
          <div className="prose prose-sm max-w-none">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
