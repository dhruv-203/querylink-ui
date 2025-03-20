import Layout from "@/components/layout/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import AskQuery from "@/pages/AskQuery";
import NotFound from "@/pages/NotFound";
import UploadData from "@/pages/UploadData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          pauseOnHover
          transition={Slide}
        />
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
