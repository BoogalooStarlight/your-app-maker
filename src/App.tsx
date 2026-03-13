import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Smoking from "./pages/Smoking";
import Modules from "./pages/Modules";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ComingSoon from "./pages/ComingSoon";
import Trophies from "./pages/Trophies";
import SmokingChoice from "./pages/SmokingChoice";
import Alcohol from "./pages/Alcohol";
import Drugs from "./pages/Drugs";
import Balloons from "./pages/Balloons";
import Behavioral from "./pages/Behavioral";
import Substances from "./pages/Substances";
import SubstancesChoice from "./pages/SubstancesChoice";
import Gambling from "./pages/Gambling";
import Pornography from "./pages/Pornography";
import Fornication from "./pages/Fornication";
import FornicationChoice from "./pages/FornicationChoice";
import Screentime from "./pages/Screentime";
import Food from "./pages/Food";

const queryClient = new QueryClient();

const ProtectedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedApp />}>
            <Route path="/" element={<Home />} />
            <Route path="/smoking" element={<Smoking />} />
            <Route path="/alcohol" element={<ComingSoon />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/trophees" element={<Trophies />} />
            <Route path="/app/smoking-choice" element={<SmokingChoice />} />
            <Route path="/app/alcohol" element={<Alcohol />} />
            <Route path="/app/food" element={<Food />} />
            <Route path="/app/puff" element={<ComingSoon />} />
            <Route path="/app/drugs" element={<Drugs />} />
            <Route path="/app/balloons" element={<Balloons />} />
            <Route path="/app/behavioral" element={<Behavioral />} />
            <Route path="/app/substances" element={<SubstancesChoice />} />
            <Route path="/app/substances/cannabis" element={<Substances slug="cannabis" />} />
            <Route path="/app/substances/herbe" element={<Substances slug="herbe" />} />
            <Route path="/app/substances/ballons" element={<Substances slug="ballons" />} />
            <Route path="/app/substances/autre" element={<Substances slug="autre" />} />
            <Route path="/app/substances/cafeine" element={<Substances slug="cafeine" />} />
            <Route path="/app/gambling" element={<Gambling />} />
            <Route path="/app/pornography" element={<Pornography />} />
            <Route path="/app/fornication" element={<FornicationChoice />} />
            <Route path="/app/fornication/regard" element={<Fornication slug="fornication-regard" />} />
            <Route path="/app/fornication/interactions" element={<Fornication slug="fornication-interactions" />} />
            <Route path="/app/fornication/contact" element={<Fornication slug="fornication-contact" />} />
            <Route path="/app/fornication/acte" element={<Fornication slug="fornication-acte" />} />
            <Route path="/app/screentime" element={<Screentime />} />
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
