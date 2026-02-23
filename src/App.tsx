import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Smoking from "./pages/Smoking";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Alcohol from "./pages/Alcohol";
import Drugs from "./pages/Drugs";
import Balloons from "./pages/Balloons";
import Behavioral from "./pages/Behavioral";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smoking" element={<Smoking />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/alcohol" element={<ComingSoon />} />
          <Route path="/app/alcohol" element={<Alcohol />} />
          <Route path="/app/drugs" element={<Drugs />} />
          <Route path="/app/balloons" element={<Balloons />} />
          <Route path="/app/behavioral" element={<Behavioral />} />
          <Route path="/mental" element={<ComingSoon />} />
          <Route path="/energy" element={<ComingSoon />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
