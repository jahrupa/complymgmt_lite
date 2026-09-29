import React, { useEffect, useRef, useState } from "react";
import {
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";

// Multi select with checkboxes; options are plain strings
export const MultiFilter = ({ label, value, options = [], onChange, width = 190 }) => (
    <FormControl size="small" sx={{ width }}>
        <InputLabel>{label}</InputLabel>
        <Select
            multiple
            value={value}
            onChange={(e) => {
                const v = e.target.value;
                onChange(typeof v === "string" ? v.split(",") : v);
            }}
            input={<OutlinedInput label={label} />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
        >
            {options.length === 0 && (
                <MenuItem disabled>
                    <em>No options</em>
                </MenuItem>
            )}
            {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                    <Checkbox size="small" checked={value.includes(opt)} />
                    <ListItemText primary={opt} />
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

// Single select; options are { value, label }
export const SingleFilter = ({ label, value, options, onChange, emptyLabel = "All", width = 150 }) => (
    <FormControl size="small" sx={{ width }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
            <MenuItem value="">
                <em>{emptyLabel}</em>
            </MenuItem>
            {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

// From / To month pickers over a newest-first { month, label } list
export const PeriodFilter = ({ months = [], monthFrom, monthTo, onChange }) => {
    const options = months.filter((m) => m.month).map((m) => ({ value: m.month, label: m.label }));
    return (
        <>
            <SingleFilter label="From" value={monthFrom} options={options} emptyLabel="Any" onChange={(v) => onChange({ month_from: v })} />
            <SingleFilter label="To" value={monthTo} options={options} emptyLabel="Any" onChange={(v) => onChange({ month_to: v })} />
        </>
    );
};

// Search box that reports its value 300 ms after typing stops
export const DebouncedSearch = ({ value, onChange, placeholder, width = 340 }) => {
    const [text, setText] = useState(value);
    const timerRef = useRef();

    // Keep the box in sync when search changes from outside (reset, back/forward navigation)
    useEffect(() => {
        setText(value);
    }, [value]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return (
        <TextField
            size="small"
            label="Search"
            placeholder={placeholder}
            value={text}
            onChange={(e) => {
                const next = e.target.value;
                setText(next);
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => onChange(next.trim()), 300);
            }}
            sx={{ width }}
        />
    );
};

// On/off filter stored as "true" / ""
export const ToggleChip = ({ label, value, onChange }) => {
    const active = value === "true";
    return (
        <Chip
            label={label}
            color={active ? "primary" : "default"}
            variant={active ? "filled" : "outlined"}
            onClick={() => onChange(active ? "" : "true")}
        />
    );
};
