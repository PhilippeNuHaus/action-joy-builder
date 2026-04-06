import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import TakeAction from "./pages/TakeAction.tsx";
import WhatsNearYou from "./pages/WhatsNearYou.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import CampaignRedirect from "./pages/CampaignRedirect.tsx";
import InTheNews from "./pages/InTheNews.tsx";
import Resources from "./pages/Resources.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/take-action" element={<TakeAction />} />
          <Route path="/whats-near-you" element={<WhatsNearYou />} />
          <Route path="/in-the-news" element={<InTheNews />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/go/:channel" element={<CampaignRedirect />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
