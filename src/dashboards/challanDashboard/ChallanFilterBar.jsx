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
const MultiFilter = ({ label, value, options, onChange }) => (
    <FormControl size="small" sx={{ width: 190 }}>
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

const SingleFilter = ({ label, value, options, onChange, emptyLabel = "All", width = 150 }) => (
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

const TOGGLES = [
    { key: "overdue", label: "Overdue" },
    { key: "exceptions_only", label: "Exceptions only" },
    { key: "data_issues_only", label: "Data issues only" },
];

const ChallanFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const [searchText, setSearchText] = useState(filters.search);
    const searchTimerRef = useRef();

    // Keep the box in sync when search changes from outside (clear, back/forward navigation)
    useEffect(() => {
        setSearchText(filters.search);
    }, [filters.search]);

    useEffect(() => () => clearTimeout(searchTimerRef.current), []);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => onChange({ search: value.trim() }), 300);
    };

    const set = (key) => (value) => onChange({ [key]: value });

    // Location options narrow down to the selected states
    const locationOptions = [
        ...new Set(
            (filterOptions?.locations || [])
                .filter((l) => !filters.state.length || filters.state.includes(l.state))
                .map((l) => l.location)
        ),
    ];

    const monthOptions = (filterOptions?.wage_months || [])
        .filter((m) => m.month)
        .map((m) => ({ value: m.month, label: m.label }));

    return (
        <div className="challan-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <SingleFilter
                    label="From"
                    value={filters.month_from}
                    options={monthOptions}
                    emptyLabel="Any"
                    onChange={set("month_from")}
                />
                <SingleFilter
                    label="To"
                    value={filters.month_to}
                    options={monthOptions}
                    emptyLabel="Any"
                    onChange={set("month_to")}
                />
                <MultiFilter label="State" value={filters.state} options={filterOptions?.states || []} onChange={set("state")} />
                <MultiFilter label="Location" value={filters.location} options={locationOptions} onChange={set("location")} />
                <MultiFilter label="Act" value={filters.act} options={filterOptions?.acts || []} onChange={set("act")} />
                <MultiFilter
                    label="Compliance Status"
                    value={filters.compliance_status}
                    options={filterOptions?.compliance_statuses || []}
                    onChange={set("compliance_status")}
                />
                <MultiFilter
                    label="Payment Responsibility"
                    value={filters.payment_responsibility}
                    options={filterOptions?.payment_responsibilities || []}
                    onChange={set("payment_responsibility")}
                />
                <MultiFilter label="Frequency" value={filters.frequency} options={filterOptions?.frequencies || []} onChange={set("frequency")} />
                <MultiFilter label="Maker" value={filters.maker} options={filterOptions?.makers || []} onChange={set("maker")} />
                <MultiFilter label="Checker" value={filters.checker} options={filterOptions?.checkers || []} onChange={set("checker")} />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                <TextField
                    size="small"
                    label="Search"
                    placeholder="Company, location, act, registration no, remarks…"
                    value={searchText}
                    onChange={onSearchChange}
                    sx={{ width: 340 }}
                />
                <SingleFilter
                    label="Paid On Time"
                    value={filters.paid_on_time}
                    options={[
                        { value: "Y", label: "Yes" },
                        { value: "N", label: "No" },
                    ]}
                    emptyLabel="Any"
                    onChange={set("paid_on_time")}
                />
                {TOGGLES.map((t) => {
                    const active = filters[t.key] === "true";
                    return (
                        <Chip
                            key={t.key}
                            label={t.label}
                            color={active ? "primary" : "default"}
                            variant={active ? "filled" : "outlined"}
                            onClick={() => onChange({ [t.key]: active ? "" : "true" })}
                        />
                    );
                })}
                {filters.wage_month.length > 0 && (
                    <Chip label={`Wage month: ${filters.wage_month.join(", ")}`} onDelete={() => onChange({ wage_month: [] })} />
                )}
                {filters.registration_no.length > 0 && (
                    <Chip label={`Registration: ${filters.registration_no.join(", ")}`} onDelete={() => onChange({ registration_no: [] })} />
                )}
                <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={onClear}>
                    Reset filters
                </button>
            </div>
        </div>
    );
};

export default ChallanFilterBar;
