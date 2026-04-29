"use client";

import { useState } from "react";
import TamvcrumsEcg from "@/components/tamv/tamvcrums-ecg";
import FederationRing from "@/components/tamv/federation-ring";

type View = "ecg" | "ring";

export default function DashboardPage() {
  const [view, setView] = useState<View>("ecg");

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <button className="border px-3 py-1 rounded" onClick={() => setView("ecg")}>ECG</button>
        <button className="border px-3 py-1 rounded" onClick={() => setView("ring")}>Anillo 195</button>
      </div>
      {view === "ecg" ? <TamvcrumsEcg /> : <FederationRing />}
    </div>
  );
}
