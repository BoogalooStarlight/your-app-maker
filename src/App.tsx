import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Modules from "./pages/Modules";
import Trophies from "./pages/Trophies";
import Smoking from "./pages/Smoking";
import Alcohol from "./pages/Alcohol";
import Drugs from "./pages/Drugs";
import Balloons from "./pages/Balloons";
import Behavioral from "./pages/Behavioral";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/trophees" element={<Trophies />} />
          <Route path="/smoking" element={<Smoking />} />
          <Route path="/alcohol" element={<ComingSoon />} />
          <Route path="/app/smoking" element={<Smoking />} />
          <Route path="/app/alcohol" element={<Alcohol />} />
          <Route path="/app/drugs" element={<Drugs />} />
          <Route path="/app/balloons" element={<Balloons />} />
          <Route path="/app/behavioral" element={<Behavioral />} />
          <Route path="/mental" element={<ComingSoon />} />
          <Route path="/energy" element={<ComingSoon />} />
          <Route path="/heart" element={<ComingSoon />} />
          <Route path="/balloons" element={<ComingSoon />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
