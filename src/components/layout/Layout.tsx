
import React, { useState } from "react";
import { Sidebar, SidebarToggle } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatListUpdated, setChatListUpdated] = useState(0);

  // Add this to the global window object to allow components to trigger updates
  if (typeof window !== 'undefined') {
    (window as any).updateChatList = () => {
      setChatListUpdated(prev => prev + 1);
    };
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        chatListUpdated={chatListUpdated}
      />
      
      <div className="flex-1 flex flex-col w-full md:ml-72">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarToggle toggleSidebar={toggleSidebar} />
          <div className="flex-1" />
        </header>
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
