import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// Tab switcher for the records table sheets; sheets are [{ key, label }]
const SheetTabs = ({ sheets, value, onChange }) => (
    <ToggleButtonGroup size="small" exclusive value={value} onChange={(e, val) => val && onChange(val)}>
        {sheets.map((s) => (
            <ToggleButton key={s.key} value={s.key} sx={{ py: 0.25, textTransform: "none" }}>
                {s.label}
            </ToggleButton>
        ))}
    </ToggleButtonGroup>
);

export default SheetTabs;
