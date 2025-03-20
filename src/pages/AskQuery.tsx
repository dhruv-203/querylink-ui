
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ChatHistory from "@/components/chat/ChatHistory";
import ChatInput from "@/components/chat/ChatInput";

const AskQuery: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [chatTitle, setChatTitle] = useState<string>("New Chat");
  const [chatUpdated, setChatUpdated] = useState<number>(0); // Counter to trigger re-fetch
  
  const isNewChat = !conversationId || conversationId === "new";
  
  const handleChatTitleChange = (title: string) => {
    setChatTitle(title);
  };
  
  const handleMessageSent = (chatId: string) => {
    // If it was a new chat, navigate to the new conversation route
    if (isNewChat) {
      navigate(`/ask-query/${chatId}`, { replace: true });
    } else {
      // Otherwise just increment the counter to trigger a re-fetch
      setChatUpdated(prev => prev + 1);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{chatTitle} | ChatQuery</title>
      </Helmet>
      
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <ChatHistory 
          chatId={isNewChat ? null : conversationId}
          onChatLoaded={handleChatTitleChange}
          chatUpdated={chatUpdated}
        />
        <ChatInput 
          chatId={isNewChat ? null : conversationId}
          onMessageSent={handleMessageSent}
          disabled={!isNewChat && conversationId !== undefined}
        />
      </div>
    </>
  );
};

export default AskQuery;
