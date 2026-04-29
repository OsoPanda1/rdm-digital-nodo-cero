"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage("Registro creado en el SOT ✅");
      setEmail("");
      return;
    }

    const data = await res.json();
    setMessage(data.error ?? "No se pudo registrar");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-bold">RDM DIGITAL — Sistema Operativo Territorial</h1>
      <p className="text-sm text-neutral-600">Registro inicial Vercel-ready con APIs serverless y motor económico.</p>
      <input
        className="rounded border p-3"
        type="email"
        value={email}
        placeholder="correo@dominio.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="rounded bg-black px-4 py-3 text-white" onClick={register}>
        Entrar
      </button>
      {message ? <p className="text-sm">{message}</p> : null}
    </main>
  );
}
