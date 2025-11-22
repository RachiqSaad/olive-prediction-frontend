"use client";

import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { FaPlus, FaTable, FaCode, FaCopy } from "react-icons/fa";

type Row = {
  sterols: number;
  triglycerides: number;
  phenols: number;
  acidite: number;
  alcools_triterpeniques: number;
  derives_tocopherol: number;
  acides_gras: number;
  densite_huile: number;
  ph: number;
  vitamine_e: number;
  polyphenols: number;
};

export default function Home() {
  const emptyRow: Row = {
    sterols: 0,
    triglycerides: 0,
    phenols: 0,
    acidite: 0,
    alcools_triterpeniques: 0,
    derives_tocopherol: 0,
    acides_gras: 0,
    densite_huile: 0,
    ph: 0,
    vitamine_e: 0,
    polyphenols: 0,
  };

  const [mode, setMode] = useState<"table" | "json">("table");
  const [rows, setRows] = useState<Row[]>([emptyRow]);
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleJSON = [
    {
      sterols: 7.2,
      triglycerides: 0.24,
      phenols: 0.30,
      acidite: 1.6,
      alcools_triterpeniques: 0.048,
      derives_tocopherol: 45.0,
      acides_gras: 170.0,
      densite_huile: 1001.0,
      ph: 3.0,
      vitamine_e: 0.45,
      polyphenols: 8.8,
    },
  ];

  const addRow = () => {
    setRows([...rows, emptyRow]);
  };

  // ✅ correction définitive TypeScript
  const handleChange = (
    index: number,
    field: keyof Row,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value);
    setRows(newRows);
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    let payload;

    if (mode === "table") payload = rows;
    else {
      try {
        payload = JSON.parse(jsonInput);
        if (!Array.isArray(payload)) payload = [payload];
      } catch {
        alert("JSON invalide !");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(
        "https://olive-prediction-backend.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Impossible de contacter l'API");
    }

    setLoading(false);
  };

  const copyExample = () => {
    navigator.clipboard.writeText(
      JSON.stringify(exampleJSON, null, 2)
    );
    alert("JSON copié !");
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img src="/image.png" alt="Logo Huile" style={{ width: 80 }} />
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#2E7D32" }}>
          Prédiction de Qualité d’Huile
        </h1>
      </header>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() => setMode("table")}
          disabled={mode === "table"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 15px",
            borderRadius: 6,
          }}
        >
          <FaTable /> Mode Tableau
        </button>

        <button
          onClick={() => setMode("json")}
          disabled={mode === "json"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#1976D2",
            color: "white",
            padding: "8px 15px",
            borderRadius: 6,
          }}
        >
          <FaCode /> Mode JSON
        </button>
      </div>

      {mode === "table" ? (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f0f8ff",
                padding: 15,
                borderRadius: 12,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 10,
              }}
            >
              {Object.entries(row).map(([field, value]) => (
                <div key={field} style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>
                    {field}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleChange(i, field as keyof Row, e.target.value)
                    }
                    style={{
                      width: "90%",
                      padding: 5,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={15}
            placeholder="Entrez votre JSON ici"
            style={{
              width: "50%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          />

          <div
            style={{
              width: "50%",
              backgroundColor: "#f5f5f5",
              padding: 15,
              borderRadius: 8,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Exemple JSON :</strong>

              <button
                onClick={copyExample}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  backgroundColor: "#1976D2",
                  color: "white",
                  borderRadius: 5,
                }}
              >
                <FaCopy /> Copier
              </button>
            </div>

            <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {JSON.stringify(exampleJSON, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          onClick={addRow}
          style={{
            padding: "10px 15px",
            backgroundColor: "#FF9800",
            color: "white",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <FaPlus /> Ajouter une ligne
        </button>

        <button
          onClick={handlePredict}
          style={{
            padding: "12px 25px",
            backgroundColor: "#2E7D32",
            color: "white",
            fontWeight: "bold",
            borderRadius: 6,
          }}
        >
          Prédire
        </button>
      </div>

      {loading && <p style={{ marginTop: 15 }}>⏳ Chargement...</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}
