import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsTable from "./components/ResultsTable";
import LoadingState from "./components/LoadingState";
import "./App.css";

const MOCK_DATA = {
  columns: ["name", "focus_area", "founded", "funding", "headquarters", "key_product"],
  rows: [
    { name: "Tempus AI", focus_area: "Precision Medicine & Oncology", founded: "2015", funding: "$1.3B", headquarters: "Chicago, IL", key_product: "AI-powered genomic sequencing platform", source_url: "https://www.tempus.com" },
    { name: "Recursion Pharmaceuticals", focus_area: "Drug Discovery", founded: "2013", funding: "$850M", headquarters: "Salt Lake City, UT", key_product: "OS platform for biological data", source_url: "https://www.recursion.com" },
    { name: "Flatiron Health", focus_area: "Oncology Data & Research", founded: "2012", funding: "$313M", headquarters: "New York, NY", key_product: "OncoEMR clinical software", source_url: "https://flatiron.com" },
    { name: "Butterfly Network", focus_area: "Medical Imaging", founded: "2011", funding: "$350M", headquarters: "Burlington, MA", key_product: "Butterfly iQ handheld ultrasound", source_url: "https://www.butterflynetwork.com" },
    { name: "Insilico Medicine", focus_area: "Drug Discovery & Aging", founded: "2014", funding: "$400M", headquarters: "Hong Kong / NYC", key_product: "Pharma.AI generative chemistry platform", source_url: "https://insilico.com" },
  ],
};

const EXAMPLES = [
  "AI startups in healthcare",
  "top pizza places in Brooklyn",
  "open source database tools",
  "climate tech unicorns 2024",
];

export default function App() {
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [query, setQuery] = useState("");

const handleSearch = async (q) => {
  setQuery(q);
  setState("loading");
  setLoadingStep(0);

  // Animate loading steps while waiting for backend
  const stepInterval = setInterval(() => {
    setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
  }, 1500);

  try {
    const res = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const result = await res.json();
    clearInterval(stepInterval);
    setLoadingStep(4);
    setData({ ...result, query: q });
    setState("results");
  } catch (e) {
    clearInterval(stepInterval);
    setState("error");
  }
};

  const handleReset = () => {
    setState("idle");
    setData(null);
    setQuery("");
    setLoadingStep(0);
  };

  const exportCSV = () => {
    if (!data) return;
    const headers = [...data.columns, "source_url"];
    const rows = data.rows.map((r) => headers.map((h) => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentic-search-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <div className="bg-noise" />
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />
      <header className="header">
        <button className="logo" onClick={handleReset}>
          <span className="logo-bracket">[</span>
          <span className="logo-word">AGENTIC</span>
          <span className="logo-sep">·</span>
          <span className="logo-word accent">SEARCH</span>
          <span className="logo-bracket">]</span>
        </button>
        <p className="tagline">Query the web — extract structure — trace every fact</p>
      </header>
      <main className="main">
        {state === "idle" && (
          <div className="hero">
            <div className="hero-title-wrap">
              <h1 className="hero-title">
                Turn any query into<br />
                <span className="hero-title-hl">structured intelligence</span>
              </h1>
              <p className="hero-sub">Agentic Search scrapes the web, extracts entities, and builds a traceable data table — automatically.</p>
            </div>
            <SearchBar onSearch={handleSearch} />
            <div className="examples">
              <span className="examples-label">Try:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex} className="example-chip" onClick={() => handleSearch(ex)}>{ex}</button>
              ))}
            </div>
          </div>
        )}
        {state === "loading" && <LoadingState step={loadingStep} query={query} />}
        {state === "results" && data && (
          <div className="results-wrapper">
            <div className="results-topbar">
              <div className="results-meta">
                <span className="results-query-label">Results for</span>
                <span className="results-query-text">"{data.query}"</span>
                <span className="results-badge">{data.rows.length} entities</span>
              </div>
              <div className="results-actions">
                <button className="btn-outline" onClick={exportCSV}>↓ CSV</button>
                <button className="btn-outline" onClick={handleReset}>← New Search</button>
              </div>
            </div>
            <ResultsTable columns={data.columns} rows={data.rows} />
            <p className="results-note">↗ Click any row to open its source · Each value is traceable to its origin page</p>
          </div>
        )}
        {state === "error" && (
          <div className="error-state">
            <p className="error-msg">Something went wrong.</p>
            <button className="btn-primary" onClick={handleReset}>Try Again</button>
          </div>
        )}
      </main>
      <footer className="footer">
        <span>CIIR Agentic Search Challenge</span>
        <span className="footer-dot">·</span>
        <span>Openapi + Brave Search</span>
      </footer>
    </div>
  );
}