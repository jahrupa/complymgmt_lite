import React, { useMemo, useState } from "react";
import { TablePagination } from "@mui/material";
import { AlertTriangle, Download, RotateCcw, Search } from "lucide-react";
import { downloadBlob } from "../utils/bulkUpload";
import {
    FILTERS,
    STATUSES,
    STATUS_BY_KEY,
    clearedCount,
    formatChange,
    formatSkip,
    isCleared,
    resultsToCsv,
    totalCleared,
} from "./taggingUtils";

const PAGE_SIZES = [25, 50, 100];

/**
 * Result of a dry run or an apply: summary cards, a warning when existing tags get
 * cleared, and a filterable, searchable, paginated table of every sheet row.
 */
const TaggingResults = ({ result, mode, onReset }) => {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

    const isPreview = mode === "preview";
    const { summary, rows } = result;

    const counts = useMemo(
        () => Object.fromEntries(FILTERS.map((f) => [f.key, rows.filter(f.test).length])),
        [rows]
    );
    const clearedFields = useMemo(() => totalCleared(rows), [rows]);

    const visibleRows = useMemo(() => {
        const test = FILTERS.find((f) => f.key === filter)?.test || (() => true);
        const term = search.trim().toLowerCase();
        return rows.filter(
            (r) =>
                test(r) &&
                (!term ||
                    String(r.doc_id ?? "").toLowerCase().includes(term) ||
                    String(r.file_name ?? "").toLowerCase().includes(term))
        );
    }, [rows, filter, search]);

    const lastPage = Math.max(0, Math.ceil(visibleRows.length / pageSize) - 1);
    const currentPage = Math.min(page, lastPage);
    const pageRows = visibleRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const applyFilter = (key) => {
        setFilter(key);
        setPage(0);
    };

    const downloadCsv = () => {
        // The BOM makes Excel read the file as UTF-8, so "→" and non-ASCII names survive.
        const blob = new Blob(["﻿", resultsToCsv(rows)], { type: "text/csv;charset=utf-8" });
        downloadBlob(blob, `document_bulk_tagging_${isPreview ? "dry_run" : "results"}.csv`);
    };

    const cards = [
        { key: "all", label: "Total", tone: "total", value: summary.total ?? rows.length },
        ...STATUSES.map((s) => ({ key: s.key, label: s.label, tone: s.tone, value: summary[s.key] ?? counts[s.key] })),
    ];

    return (
        <div className="client-onboarding-panel bulk-tagging-results">
            {isPreview ? (
                <div className="alert alert-info py-2 mb-3">
                    <strong>Dry run — nothing has been saved yet</strong>
                    {result.message && <div className="small">{result.message}</div>}
                </div>
            ) : (
                <div className="alert alert-success py-2 mb-3">
                    <strong>Tagging applied. A detailed report has been emailed to you.</strong>
                    {result.message && <div className="small">{result.message}</div>}
                </div>
            )}

            <div className="bulk-tagging-cards">
                {cards.map((c) => (
                    <button
                        key={c.key}
                        type="button"
                        className={`bulk-tagging-card tone-${c.tone} ${filter === c.key ? "active" : ""}`}
                        onClick={() => applyFilter(c.key)}
                        title={`Show ${c.label.toLowerCase()} rows`}
                    >
                        <span className="bulk-tagging-card-value">{c.value ?? 0}</span>
                        <span className="bulk-tagging-card-label">{c.label}</span>
                    </button>
                ))}
            </div>

            {clearedFields > 0 && (
                <div className="bulk-tagging-cleared-banner">
                    <AlertTriangle size={18} className="flex-shrink-0" />
                    <div className="flex-grow-1">
                        <strong>
                            {clearedFields} existing {clearedFields === 1 ? "tag" : "tags"} on {counts.cleared}{" "}
                            {counts.cleared === 1 ? "document" : "documents"} {isPreview ? "will be" : "were"} cleared
                        </strong>
                        <div className="small">
                            {isPreview
                                ? "A parent value changed, so children that don't belong to the new parent are removed. Review these before applying."
                                : "A parent value changed, so children that didn't belong to the new parent were removed."}
                        </div>
                    </div>
                    {filter !== "cleared" && (
                        <button type="button" className="btn btn-sm btn-outline-warning text-nowrap" onClick={() => applyFilter("cleared")}>
                            Show these rows
                        </button>
                    )}
                </div>
            )}

            <div className="bulk-tagging-toolbar">
                <div className="bulk-tagging-chips" role="tablist" aria-label="Filter rows by status">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            role="tab"
                            aria-selected={filter === f.key}
                            className={`bulk-tagging-chip ${filter === f.key ? "active" : ""}`}
                            onClick={() => applyFilter(f.key)}
                        >
                            {f.label} <span className="bulk-tagging-chip-count">{counts[f.key]}</span>
                        </button>
                    ))}
                </div>
                <div className="bulk-tagging-search">
                    <Search size={14} />
                    <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder="Search doc_id or file_name"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
            </div>

            <div className="bulk-tagging-table-wrap">
                <table className="table table-sm align-middle mb-0 bulk-tagging-table">
                    <thead>
                        <tr>
                            <th style={{ width: 64 }}>Row</th>
                            <th>doc_id</th>
                            <th>file_name</th>
                            <th>Status</th>
                            <th>Changes</th>
                            <th>Skipped / Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    {rows.length === 0 ? "The file has no rows" : "No rows match the current filter"}
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((r, i) => {
                                const status = STATUS_BY_KEY[r.status];
                                return (
                                    <tr key={`${r.row}-${i}`} className={clearedCount(r) > 0 ? "has-cleared" : ""}>
                                        <td className="text-muted">{r.row}</td>
                                        <td className="text-nowrap">{r.doc_id}</td>
                                        <td className="bulk-tagging-file-cell" title={r.file_name}>{r.file_name}</td>
                                        <td>
                                            <span className={`bulk-tagging-badge tone-${status?.tone || "unchanged"}`}>
                                                {status?.label || r.status}
                                            </span>
                                        </td>
                                        <td>
                                            {r.changes.length === 0 ? (
                                                <span className="text-muted">—</span>
                                            ) : (
                                                r.changes.map((c, j) =>
                                                    isCleared(c) ? (
                                                        <div key={j} className="bulk-tagging-line bulk-tagging-cleared">
                                                            <AlertTriangle size={12} /> {formatChange(c)}
                                                        </div>
                                                    ) : (
                                                        <div key={j} className="bulk-tagging-line">{formatChange(c)}</div>
                                                    )
                                                )
                                            )}
                                        </td>
                                        <td>
                                            {r.message && <div className="bulk-tagging-line text-danger">{r.message}</div>}
                                            {r.skipped.map((s, j) => (
                                                <div key={j} className="bulk-tagging-line bulk-tagging-skipped">{formatSkip(s)}</div>
                                            ))}
                                            {!r.message && r.skipped.length === 0 && <span className="text-muted">—</span>}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                component="div"
                count={visibleRows.length}
                page={currentPage}
                onPageChange={(_, next) => setPage(next)}
                rowsPerPage={pageSize}
                rowsPerPageOptions={PAGE_SIZES}
                onRowsPerPageChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                }}
            />

            <div className="d-flex flex-wrap gap-2 justify-content-end">
                <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={downloadCsv}>
                    <Download size={14} /> Download results (CSV)
                </button>
                {!isPreview && (
                    <button type="button" className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={onReset}>
                        <RotateCcw size={14} /> Upload another file
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaggingResults;
