import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Summit from "./pages/Summit";
import About from "./pages/About";
import Membership from "./pages/Membership";
import Sponsor from "./pages/Sponsor";
import Partner from "./pages/Partner";
import MediaKit from "./pages/MediaKit";
import SummitProfiles from "./pages/SummitProfiles";
import SummitVerify from "./pages/SummitVerify";
import SummitSetup from "./pages/SummitSetup";
import SummitEdit from "./pages/SummitEdit";
import SummitWall from "./pages/SummitWall";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/summit" element={<Summit />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/media-kit" element={<MediaKit />} />
          <Route path="/summit-profiles" element={<SummitProfiles />} />
          <Route path="/summit-profiles/verify" element={<SummitVerify />} />
          <Route path="/summit-profiles/setup" element={<SummitSetup />} />
          <Route path="/summit-profiles/edit" element={<SummitEdit />} />
          <Route path="/summit-profiles/wall" element={<SummitWall />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
