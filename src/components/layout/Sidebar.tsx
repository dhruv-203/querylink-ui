
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, MessageSquare, Upload, PenLine, Trash2, X, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ChatHistory, fetchChatHistory, renameChatHistory, deleteChatHistory } from "@/lib/api";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // Fetch chat history on mount
  React.useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const history = await fetchChatHistory();
        setChatHistories(history);
      } catch (error) {
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const handleChatClick = (chatId: string) => {
    navigate(`/ask-query/${chatId}`);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleNewChat = () => {
    navigate("/ask-query/new");
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleUploadData = () => {
    navigate("/upload-data");
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const openRenameDialog = (chat: ChatHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChat(chat);
    setNewTitle(chat.title);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (chat: ChatHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChat(chat);
    setDeleteDialogOpen(true);
  };

  const handleRename = async () => {
    if (!selectedChat || !newTitle.trim()) return;
    
    try {
      const updatedChat = await renameChatHistory(selectedChat.id, newTitle);
      setChatHistories(prev => 
        prev.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
      setRenameDialogOpen(false);
      toast.success("Chat renamed successfully");
    } catch (error) {
      toast.error("Failed to rename chat");
    }
  };

  const handleDelete = async () => {
    if (!selectedChat) return;
    
    try {
      await deleteChatHistory(selectedChat.id);
      setChatHistories(prev => prev.filter(chat => chat.id !== selectedChat.id));
      setDeleteDialogOpen(false);
      
      // If we're currently viewing the deleted chat, navigate to a new chat
      if (location.pathname.includes(selectedChat.id)) {
        navigate("/ask-query/new");
      }
      
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const isAskQueryActive = location.pathname.startsWith('/ask-query');
  const isUploadDataActive = location.pathname.startsWith('/upload-data');

  return (
    <>
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out shadow-lg md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="font-semibold text-lg text-sidebar-foreground">ChatQuery</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-3">
          <Button 
            onClick={handleNewChat}
            className="w-full justify-start gap-2 mb-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 px-3">
          <Button
            variant={isAskQueryActive ? "secondary" : "ghost"}
            className="justify-start gap-2"
            onClick={() => navigate('/ask-query/new')}
          >
            <MessageSquare className="h-4 w-4" />
            Ask a Query
          </Button>
          
          <Button
            variant={isUploadDataActive ? "secondary" : "ghost"}
            className="justify-start gap-2"
            onClick={handleUploadData}
          >
            <Upload className="h-4 w-4" />
            Upload Data
          </Button>
        </div>
        
        <div className="mt-6 px-3">
          <h3 className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-3">CHAT HISTORY</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse w-full space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-sidebar-accent rounded" />
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 pr-2">
                {chatHistories.map((chat) => {
                  const isActive = location.pathname.includes(chat.id);
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer group transition-colors",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-sidebar-foreground/60 truncate">{chat.lastMessage}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", 
                        isActive && "opacity-100"
                      )}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={(e) => openRenameDialog(chat, e)}
                            >
                              <PenLine className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={(e) => openDeleteDialog(chat, e)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
                
                {chatHistories.length === 0 && (
                  <div className="px-3 py-10 text-center">
                    <p className="text-sm text-sidebar-foreground/60">No chat history found</p>
                    <Button 
                      variant="link" 
                      className="mt-2 text-sidebar-primary"
                      onClick={handleNewChat}
                    >
                      Start a new chat
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full"
              placeholder="Enter new title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const SidebarToggle: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="md:hidden ml-2"
    >
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
};
