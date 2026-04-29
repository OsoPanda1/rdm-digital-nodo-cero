"use client";

import { useEffect, useState } from "react";

type Summary = {
  users: number;
  commerces: number;
  transactions: number;
  paymentIntents: number;
  totalWalletBalance: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div className="p-6">Cargando métricas SOT...</div>;
  }

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-2xl font-semibold">Dashboard SOT</h1>
      <p>Usuarios: {data.users}</p>
      <p>Comercios: {data.commerces}</p>
      <p>Transacciones: {data.transactions}</p>
      <p>Intentos de pago: {data.paymentIntents}</p>
      <p>Saldo total en wallets: {data.totalWalletBalance.toFixed(2)} MXN</p>
    </div>
  );
}
