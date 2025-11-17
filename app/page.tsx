"use client";

import { useState } from "react";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Vert",
          sterols: 5,
          triglycerides: 1,
          phenols: 0.3,
          acidite: 10,
          alcools_triterpeniques: 0.05,
          derives_tocopherol: 0.8,
          acides_gras: 120,
          densite_huile: 1001,
          ph: 7.1,
          vitamine_e: 1,
          polyphenols: 12
        })
      });

      if (!res.ok) {
        throw new Error("Erreur API");
      }

      const data = await res.json();
      setResult(data);

    } catch (e: any) {
      setError("Impossible de contacter l'API");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 30, fontWeight: "bold" }}>Prédiction de Qualité d’Huile</h1>

      <button
        onClick={handlePredict}
        style={{
          background: "black",
          color: "white",
          padding: "10px 20px",
          marginTop: 20,
          borderRadius: 8
        }}
      >
        Tester la prédiction
      </button>

      {loading && <p>⏳ Chargement...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && <ResultCard result={result} />}
    </div>
  );
}
