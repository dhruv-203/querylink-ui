
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import AskQuery from "@/pages/AskQuery";
import UploadData from "@/pages/UploadData";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Helmet>
            <title>ChatQuery</title>
            <meta name="description" content="Chat with your data using AI" />
          </Helmet>
          <Layout>
            <Routes>
              <Route path="/" element={<AskQuery />} />
              <Route path="/ask-query/:conversationId" element={<AskQuery />} />
              <Route path="/upload-data" element={<UploadData />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
