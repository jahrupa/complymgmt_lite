import React from "react";

export default function ColumnDropdown({ columns, value, onSelect }) {
  return (
    <div>
      <label htmlFor="columns">Source: </label>
      <select
        id="columns"
        value={value || ""} // <-- controlled value
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>
          -- Select a column --
        </option>
        {columns.map((col, idx) => (
          <option key={idx} value={col}>
            {col}
          </option>
        ))}
      </select>
    </div>
  );
}
