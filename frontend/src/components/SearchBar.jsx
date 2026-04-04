import { useState, useRef } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="searchbar-inner">
        <span className="searchbar-icon">⌕</span>
        <input
          ref={inputRef}
          className="searchbar-input"
          type="text"
          placeholder="e.g. AI startups in healthcare..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button
          className="searchbar-btn"
          type="submit"
          disabled={!value.trim()}
        >
          Search
          <span className="searchbar-btn-arrow">→</span>
        </button>
      </div>
    </form>
  );
}
