
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { UploadCloud, FileText } from "lucide-react";
import { UploadCSVModal, UploadTextModal } from "@/components/upload/UploadModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UploadData: React.FC = () => {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Upload Data | ChatQuery</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload Data</h1>
          <p className="text-muted-foreground">
            Upload your data to process and analyze it.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                Upload CSV
              </CardTitle>
              <CardDescription>
                Upload and analyze data from CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="rounded-md bg-muted/50 p-6 flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="mb-2 font-medium">Upload CSV Files</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported format: .csv
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setIsCSVModalOpen(true)}
              >
                Upload CSV
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden shadow-subtle hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Text Data
              </CardTitle>
              <CardDescription>
                Enter or paste text for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="rounded-md bg-muted/50 p-6 flex flex-col items-center justify-center text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="mb-2 font-medium">Upload Text Data</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter or paste your text directly
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setIsTextModalOpen(true)}
              >
                Enter Text
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <UploadCSVModal 
        isOpen={isCSVModalOpen} 
        onClose={() => setIsCSVModalOpen(false)} 
      />
      
      <UploadTextModal 
        isOpen={isTextModalOpen} 
        onClose={() => setIsTextModalOpen(false)} 
      />
    </>
  );
};

export default UploadData;
