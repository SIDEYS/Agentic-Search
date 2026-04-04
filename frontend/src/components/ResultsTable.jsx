import { useState } from "react";

function formatHeader(col) {
  return col.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultsTable({ columns, rows }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [filter, setFilter] = useState("");

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  let displayRows = [...rows];

  if (filter) {
    const f = filter.toLowerCase();
    displayRows = displayRows.filter((row) =>
      Object.values(row).some((v) => v?.toString().toLowerCase().includes(f))
    );
  }

  if (sortCol) {
    displayRows.sort((a, b) => {
      const av = (a[sortCol] ?? "").toString().toLowerCase();
      const bv = (b[sortCol] ?? "").toString().toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <input
          className="table-filter"
          type="text"
          placeholder="Filter results..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="table-count">
          {displayRows.length} / {rows.length} rows
        </span>
      </div>

      <div className="table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th className="th-num">#</th>
              {columns.map((col) => (
                <th
                  key={col}
                  className={`th-col ${sortCol === col ? "th-sorted" : ""}`}
                  onClick={() => handleSort(col)}
                >
                  <span>{formatHeader(col)}</span>
                  <span className="th-sort-icon">
                    {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "⇅"}
                  </span>
                </th>
              ))}
              <th className="th-source">Source</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => (
              <tr
                key={i}
                className={`tr ${hoveredRow === i ? "tr--hovered" : ""}`}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="td-num">{i + 1}</td>
                {columns.map((col) => (
                  <td key={col} className="td-cell">
                    <span className="td-value">{row[col] ?? "—"}</span>
                  </td>
                ))}
                <td className="td-source">
                  <a
                    href={row.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                    title={row.source_url}
                  >
                    ↗ {new URL(row.source_url).hostname.replace("www.", "")}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayRows.length === 0 && (
          <div className="table-empty">No results match your filter.</div>
        )}
      </div>
    </div>
  );
}
