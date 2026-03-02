import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Alcohol from "./pages/Alcohol";
import Auth from "./pages/Auth";
import Balloons from "./pages/Balloons";
import Behavioral from "./pages/Behavioral";
import ComingSoon from "./pages/ComingSoon";
import Drugs from "./pages/Drugs";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import NotFound from "./pages/NotFound";
import Smoking from "./pages/Smoking";
import SmokingChoice from "./pages/SmokingChoice";
import Trophies from "./pages/Trophies";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/smoking" element={<Smoking />} />
            <Route path="/alcohol" element={<ComingSoon />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/trophees" element={<Trophies />} />
            <Route path="/app/smoking-choice" element={<SmokingChoice />} />
            <Route path="/app/alcohol" element={<Alcohol />} />
            <Route path="/app/puff" element={<ComingSoon />} />
            <Route path="/app/drugs" element={<Drugs />} />
            <Route path="/app/balloons" element={<Balloons />} />
            <Route path="/app/behavioral" element={<Behavioral />} />
            <Route path="/mental" element={<ComingSoon />} />
            <Route path="/energy" element={<ComingSoon />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
