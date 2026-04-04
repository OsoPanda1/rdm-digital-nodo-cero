import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const GlobalSupportCTA = () => {
  return (
    <div className="fixed bottom-5 right-4 z-40">
      <Link
        to="/apoya"
        className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-transform duration-300 hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(135deg, hsl(43,85%,55%), hsl(16,90%,55%))",
          boxShadow: "0 14px 45px -18px hsla(16,90%,55%,0.75)",
        }}
      >
        <Heart className="h-4 w-4 fill-white" />
        Apoya el proyecto
      </Link>
    </div>
  );
};

export default GlobalSupportCTA;
