import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ComingSoon from "./ComingSoon";

const Behavioral = () => (
  <div className="min-h-screen bg-black text-white">
    <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
      <Link to="/modules" className="inline-flex items-center gap-2 text-white/80 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>
      <div className="mt-4">
        <ComingSoon />
      </div>
    </main>
  </div>
);

export default Behavioral;
