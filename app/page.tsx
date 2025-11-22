"use client";

import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { FaPlus, FaTable, FaCode, FaCopy } from "react-icons/fa";

export default function Home() {
  const [mode, setMode] = useState<"table" | "json">("table");
  const [rows, setRows] = useState([
    {
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
      polyphenols: 0
    }
  ]);
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleJSON = [
    {
      "sterols": 7.2,
      "triglycerides": 0.24,
      "phenols": 0.30,
      "acidite": 1.6,
      "alcools_triterpeniques": 0.048,
      "derives_tocopherol": 45.0,
      "acides_gras": 170.0,
      "densite_huile": 1001.0,
      "ph": 3.0,
      "vitamine_e": 0.45,
      "polyphenols": 8.8
    },
    {
      "sterols": 6.8,
      "triglycerides": 0.23,
      "phenols": 0.42,
      "acidite": 7.4,
      "alcools_triterpeniques": 0.044,
      "derives_tocopherol": 40.0,
      "acides_gras": 165.0,
      "densite_huile": 1002.0,
      "ph": 3.1,
      "vitamine_e": 0.42,
      "polyphenols": 8.0
    },
    {
      "sterols": 4.6,
      "triglycerides": 0.52,
      "phenols": 0.15,
      "acidite": 2.1,
      "alcools_triterpeniques": 0.054,
      "derives_tocopherol": 35.0,
      "acides_gras": 180.0,
      "densite_huile": 1003.0,
      "ph": 3.2,
      "vitamine_e": 0.40,
      "polyphenols": 7.0
    },
    {
      "sterols": 6.7,
      "triglycerides": 0.20,
      "phenols": 0.24,
      "acidite": 6.5,
      "alcools_triterpeniques": 0.044,
      "derives_tocopherol": 42.0,
      "acides_gras": 168.0,
      "densite_huile": 1001.5,
      "ph": 3.0,
      "vitamine_e": 0.44,
      "polyphenols": 8.5
    },
    {
      "sterols": 9.9,
      "triglycerides": 0.53,
      "phenols": 0.57,
      "acidite": 2.4,
      "alcools_triterpeniques": 0.093,
      "derives_tocopherol": 50.0,
      "acides_gras": 175.0,
      "densite_huile": 1000.8,
      "ph": 3.1,
      "vitamine_e": 0.50,
      "polyphenols": 9.0
    }
  ]

    ;

  // ======= Fonction manquante =======
  const addRow = () => {
    setRows([
      ...rows,
      {
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
        polyphenols: 0
      }
    ]);
  };

  const handleChange = (index: number, field: string, value: string) => {
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
      const res = await fetch("https://olive-prediction-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Impossible de contacter l'API");
    }

    setLoading(false);
  };

  const copyExample = () => {
    navigator.clipboard.writeText(JSON.stringify(exampleJSON, null, 2));
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
          style={{ display: "flex", alignItems: "center", gap: 5, backgroundColor: "#4CAF50", color: "white", padding: "8px 15px", borderRadius: 6 }}
        >
          <FaTable /> Mode Tableau
        </button>
        <button
          onClick={() => setMode("json")}
          disabled={mode === "json"}
          style={{ display: "flex", alignItems: "center", gap: 5, backgroundColor: "#1976D2", color: "white", padding: "8px 15px", borderRadius: 6 }}
        >
          <FaCode /> Mode JSON
        </button>
      </div>

      {mode === "table" ? (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              backgroundColor: "#f0f8ff",
              padding: 15,
              borderRadius: 12,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 10
            }}>
              {Object.entries(row).map(([field, value]) => (
                <div key={field} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <label style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>{field}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(i, field, e.target.value)}
                    style={{ width: "90%", padding: 5, borderRadius: 5, border: "1px solid #ccc" }}
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
            placeholder='Entrez votre JSON ici'
            style={{ width: "50%", padding: 10, borderRadius: 6, border: "1px solid #ccc", fontFamily: "monospace" }}
          />
          <div style={{ width: "50%", backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Exemple JSON :</strong>
              <button onClick={copyExample} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", backgroundColor: "#1976D2", color: "white", borderRadius: 5 }}>
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
        <button onClick={addRow} style={{ padding: "10px 15px", backgroundColor: "#FF9800", color: "white", borderRadius: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <FaPlus /> Ajouter une ligne
        </button>
        <button onClick={handlePredict} style={{ padding: "12px 25px", backgroundColor: "#2E7D32", color: "white", fontWeight: "bold", borderRadius: 6 }}>
          Prédire
        </button>
      </div>

      {loading && <p style={{ marginTop: 15 }}>⏳ Chargement...</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}
