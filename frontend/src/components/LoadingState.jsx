const STEPS = [
  { label: "Searching the web", detail: "Querying Brave Search API for top results..." },
  { label: "Scraping pages", detail: "Fetching and cleaning content from source URLs..." },
  { label: "Inferring schema", detail: "Asking Claude what columns make sense for this query..." },
  { label: "Extracting entities", detail: "Parsing structured data from each page with LLM..." },
];

export default function LoadingState({ step, query }) {
  return (
    <div className="loading-state">
      <div className="loading-query">
        Processing: <span>"{query}"</span>
      </div>
      <div className="loading-steps">
        {STEPS.map((s, i) => {
          const status = i < step ? "done" : i === step ? "active" : "waiting";
          return (
            <div key={i} className={`loading-step loading-step--${status}`}>
              <span className="loading-step-icon">
                {status === "done" ? "✓" : status === "active" ? <Spinner /> : "○"}
              </span>
              <div className="loading-step-text">
                <span className="loading-step-label">{s.label}</span>
                {status === "active" && (
                  <span className="loading-step-detail">{s.detail}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="loading-bar-wrap">
        <div className="loading-bar" style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="spinner">◌</span>;
}
