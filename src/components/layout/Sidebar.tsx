
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Upload, PenLine, Trash2, X, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
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
          "fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#1A1F2C] border-r border-[#2A2F3C] transition-transform duration-300 ease-in-out shadow-lg md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2F3C]">
          <h2 className="font-semibold text-lg text-white">ChatQuery</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white hover:bg-[#2A2F3C]">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 px-3 mt-3">
          <Button
            variant={isAskQueryActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              isAskQueryActive 
                ? "bg-[#2A2F3C] text-white hover:bg-[#3A3F4C]" 
                : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white"
            )}
            onClick={() => navigate('/ask-query/new')}
          >
            <MessageSquare className="h-4 w-4" />
            Ask a Query
          </Button>
          
          <Button
            variant={isUploadDataActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              isUploadDataActive 
                ? "bg-[#2A2F3C] text-white hover:bg-[#3A3F4C]" 
                : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white"
            )}
            onClick={handleUploadData}
          >
            <Upload className="h-4 w-4" />
            Upload Data
          </Button>
        </div>
        
        <div className="mt-6 px-3 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-3">CHAT HISTORY</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse w-full space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#2A2F3C] rounded" />
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-1">
                {chatHistories.map((chat) => {
                  const isActive = location.pathname.includes(chat.id);
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
                        isActive 
                          ? "bg-[#2A2F3C] text-white" 
                          : "text-gray-300 hover:bg-[#2A2F3C]/70 hover:text-white"
                      )}
                    >
                      <div className="flex-1 truncate pr-2">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-100">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 hover:bg-[#3A3F4C]"
                              onClick={(e) => openRenameDialog(chat, e)}
                            >
                              <PenLine className="h-3.5 w-3.5 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 hover:bg-[#3A3F4C]"
                              onClick={(e) => openDeleteDialog(chat, e)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-gray-400" />
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
                    <p className="text-sm text-gray-400">No chat history found</p>
                    <Button 
                      variant="link" 
                      className="mt-2 text-blue-400 hover:text-blue-300"
                      onClick={() => navigate('/ask-query/new')}
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
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#1A1F2C] text-white border-[#2A2F3C]">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#2A2F3C] border-[#3A3F4C] text-white"
              placeholder="Enter new title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)} className="border-[#3A3F4C] text-gray-300 hover:bg-[#2A2F3C] hover:text-white">Cancel</Button>
            <Button onClick={handleRename} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#1A1F2C] text-white border-[#2A2F3C]">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-400">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-[#3A3F4C] text-gray-300 hover:bg-[#2A2F3C] hover:text-white">Cancel</Button>
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
      className="md:hidden ml-2 text-white hover:bg-[#2A2F3C]"
    >
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
};
