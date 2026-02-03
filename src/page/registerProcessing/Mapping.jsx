import React from "react";
import ColumnDropdown from "./ColumnDropdown";

const transformFieldOptions = ["", "sum", "concat", "average", "unique", "count", "raw"];

export default function Mapping({ columns, mapping, onChange, onRemove }) {
  const handleSourceChange = (value, index) => {
    const newSources = [...mapping.Source];
    newSources[index] = value;
    onChange({ ...mapping, Source: newSources });
  };

  const addSource = () =>
    onChange({ ...mapping, Source: [...mapping.Source, ""] });

  const removeSource = (index) => {
    const newSources = mapping.Source.filter((_, i) => i !== index);
    onChange({ ...mapping, Source: newSources });
  };

  const handleTransformChange = (value) => {
    onChange({
      ...mapping,
      Transform: value === "" ? null : value,
      Params: value === "concat" ? { sep: "" } : undefined,
      Formula: value === "raw" ? mapping.Formula : undefined
    });
  };

  const updateSep = (value) => {
    onChange({
      ...mapping,
      Params: { sep: value }
    });
  };

  return (
    <div className="mapping-container">
      {/* Target */}
      <div className="mapping-target">
        <label>Target: </label>
        <input
          type="text"
          value={mapping.Target}
          onChange={(e) => onChange({ ...mapping, Target: e.target.value })}
        />
      </div>
      <div className="mapping-transform">
        <label>Company </label>
        <select
          value={mapping.Transform || ""}
          onChange={(e) => handleTransformChange(e.target.value)}
        >
          <option value="">-- None --</option>
         
        </select>
      </div><div className="mapping-transform">
        <label>Register</label>
        <select
          value={mapping.Transform || ""}
          onChange={(e) => handleTransformChange(e.target.value)}
        >
          <option value="">-- None --</option>
          
        </select>
      </div><div className="mapping-transform">
        <label>Document: </label>
        <select
          value={mapping.Transform || ""}
          onChange={(e) => handleTransformChange(e.target.value)}
        >
          <option value="">-- None --</option>
          
        </select>
      </div>
      <div className="mapping-source" >
        {mapping.Source.map((src, idx) => (
          <div key={idx}>
            <ColumnDropdown
              columns={columns}
              value={src}               
              onSelect={(value) => handleSourceChange(value, idx)}
            />
            <button onClick={() => removeSource(idx)}>Remove</button>
          </div>
        ))}
        <button onClick={addSource}>Add Source</button>
      </div>

      <div className="mapping-transform">
        <label>Transform: </label>
        <select
          value={mapping.Transform || ""}
          onChange={(e) => handleTransformChange(e.target.value)}
        >
          <option value="">-- None --</option>
          {transformFieldOptions
            .filter((t) => t !== "")
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
      </div>

      <div className="mapping-default">
        <label>Default: </label>
        <input
          type="text"
          value={mapping.Default || ""}
          onChange={(e) => onChange({ ...mapping, Default: e.target.value })}
        />
      </div>

      {mapping.Transform === "raw" && (
        <div className="mapping-formula">
          <label>Formula: </label>
          <input
            type="text"
            value={mapping.Formula || ""}
            onChange={(e) => onChange({ ...mapping, Formula: e.target.value })}
          />
        </div>
      )}

      {mapping.Transform === "concat" && (
        <div className="mapping-concat-param">
          <label>Separator: </label>
          <input
            type="text"
            value={mapping.Params?.sep || ""}
            onChange={(e) => updateSep(e.target.value)}
          />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <button onClick={onRemove} className="mapping-remove-button">
          Remove Mapping
        </button>
      </div>

    </div>
  );
}
