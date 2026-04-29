"use client";

import { useState } from "react";

export default function CommercePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const createCommerce = async () => {
    const res = await fetch("/api/commerce/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, category }),
    });

    if (!res.ok) {
      setMessage("No se pudo crear el comercio");
      return;
    }

    const created = await res.json();
    setMessage(`Comercio creado: ${created.name}`);
    setName("");
    setCategory("");
  };

  return (
    <div className="space-y-3 p-6">
      <h1 className="text-2xl font-semibold">Comercio SOT</h1>
      <input className="w-full rounded border p-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        className="w-full rounded border p-2"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="rounded bg-black px-4 py-2 text-white" onClick={createCommerce}>
        Crear comercio
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
