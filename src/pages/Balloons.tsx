import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Balloons = () => {
  return (
    <div className="min-h-screen bg-[#07090f] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/modules">
            <Button variant="ghost" size="icon" className="rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm text-white/50">Module temporaire</span>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ShieldAlert className="h-7 w-7 text-white/80" />
          </div>
          <h1 className="mt-4 text-2xl font-medium">Balloons</h1>
          <p className="mt-2 text-white/70">Coming Soon</p>
        </section>
      </div>
    </div>
  );
};

export default Balloons;
