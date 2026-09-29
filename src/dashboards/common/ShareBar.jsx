import React from "react";
import { Tooltip } from "@mui/material";

/**
 * Stacked horizontal bar of parts of a whole, with a counted legend.
 * segments: [{ key, label, color, count }]; onSegmentClick(key) drills down.
 */
const ShareBar = ({ segments, total, caption, onSegmentClick }) => (
    <div>
        <div className={`dw-share-bar ${onSegmentClick ? "clickable" : ""}`}>
            {segments
                .filter((s) => s.count > 0)
                .map((s) => (
                    <Tooltip key={s.key} title={`${s.label}: ${s.count} of ${total}`}>
                        <span
                            style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSegmentClick?.(s.key);
                            }}
                        />
                    </Tooltip>
                ))}
        </div>
        <div className="d-flex flex-wrap gap-3 mt-2 small">
            {segments.map((s) => (
                <span key={s.key} className="dw-legend">
                    <span style={{ "--swatch": s.color }}>
                        {s.label}: <strong>{s.count}</strong>
                    </span>
                </span>
            ))}
            {caption && <span className="text-muted">{caption}</span>}
        </div>
    </div>
);

export default ShareBar;
