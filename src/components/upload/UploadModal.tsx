
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { uploadCSV, uploadText } from "@/lib/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadCSVModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await uploadCSV(file);
      if (result.success) {
        toast.success(result.message);
        
        // Update chat list after successful upload
        if (typeof window !== 'undefined' && (window as any).updateChatList) {
          (window as any).updateChatList();
        }
        
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!file ? (
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById('csv-file-upload')?.click()}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">CSV files only (max 10MB)</p>
              <Input 
                id="csv-file-upload" 
                type="file" 
                className="hidden" 
                accept=".csv,text/csv" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFile(null)}
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const UploadTextModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async () => {
    if (!text.trim()) return;
    
    setIsUploading(true);
    try {
      const result = await uploadText(text);
      if (result.success) {
        toast.success(result.message);
        
        // Update chat list after successful upload
        if (typeof window !== 'undefined' && (window as any).updateChatList) {
          (window as any).updateChatList();
        }
        
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to process text");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClose = () => {
    setText("");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Text Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="text-data">Enter or paste your text</Label>
            <Textarea 
              id="text-data" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Paste your text data here..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!text.trim() || isUploading}
          >
            {isUploading ? "Processing..." : "Process Text"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
