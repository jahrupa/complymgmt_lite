import React, { useCallback, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import "../../style/clientOnboardingUpload.css";
import "../../style/documentBulkTagging.css";
import { downloadDocumentBulkTaggingTemplate, uploadDocumentBulkTaggingFile } from "../../api/service";
import Snackbars from "../../component/Snackbars";
import DeleteModal from "../../component/DeleteModal";
import FileDropzone from "../../component/FileDropzone";
import NoPageAccess from "../../component/NoPageAccess";
import { usePageAccess } from "../utils/usePageAccess";
import { apiErrorMessage, downloadBlob } from "../utils/bulkUpload";
import TaggingResults from "./TaggingResults";
import { ACCEPTED_EXT, normalizeResult, totalCleared } from "./taggingUtils";

const PAGE_NAME = "document_bulk_tagging";

const errorMessage = (error, fallback) =>
    apiErrorMessage(error, fallback, "Access denied — you don't have permission for document bulk tagging.");

const RULES = [
    "doc_id and file_name must both be filled and belong to the same document.",
    "A blank cell keeps the document's current value.",
    "Each value is matched by name within its parent. If there is no match or several matches, that field is skipped and the rest of the row is still applied.",
    "If a parent changes (e.g. company), current children that don't belong to the new parent (entity, location…) are cleared.",
    "The module / sub-module must be mapped to the location (location to module mapping).",
];

/**
 * Document Bulk Tagging: retag many Document Repository files from a spreadsheet keyed by
 * doc_id + file_name. Validate with a dry run first, then apply the same file.
 */
const DocumentBulkTagging = () => {
    const { loading: accessLoading, canView, canCreate } = usePageAccess(PAGE_NAME);

    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(null); // "template" | "preview" | "apply" | null
    const busyRef = useRef(false);
    const resultSeq = useRef(0); // remounts the results (filters, search, page) for every new response

    const [result, setResult] = useState(null);
    const [mode, setMode] = useState(null); // "preview" | "apply"
    const [previewedFile, setPreviewedFile] = useState(null);
    const [requestError, setRequestError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rulesOpen, setRulesOpen] = useState(true);
    // The server is the authority on access; a 403 from it overrides what the grants said.
    const [denied, setDenied] = useState(false);

    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const notify = useCallback(
        (message, severityType) => setIsSnackbarsOpen((p) => ({ ...p, open: true, message, severityType })),
        []
    );

    // Runs one request at a time; the ref blocks double submits before the re-render disables the buttons.
    const runExclusive = async (kind, fn) => {
        if (busyRef.current) return;
        busyRef.current = true;
        setBusy(kind);
        try {
            await fn();
        } finally {
            busyRef.current = false;
            setBusy(null);
        }
    };

    const reset = (nextFile) => {
        if (busyRef.current) return;
        setFile(nextFile);
        setResult(null);
        setMode(null);
        setPreviewedFile(null);
        setRequestError("");
    };

    const handleDownloadTemplate = () =>
        runExclusive("template", async () => {
            try {
                const blob = await downloadDocumentBulkTaggingTemplate();
                downloadBlob(blob, "document_bulk_tagging_template.xlsx");
                notify("Template downloaded", "success");
            } catch (error) {
                if (error?.response?.status === 403) setDenied(true);
                notify(await errorMessage(error, "Could not download the template"), "error");
            }
        });

    const upload = (dryRun) =>
        runExclusive(dryRun ? "preview" : "apply", async () => {
            const uploadedFile = file;
            setRequestError("");
            try {
                const data = normalizeResult(await uploadDocumentBulkTaggingFile(uploadedFile, dryRun));
                resultSeq.current += 1;
                setResult(data);
                setMode(dryRun ? "preview" : "apply");
                // A dry run unlocks apply for this exact file; after an apply it has to be validated again.
                setPreviewedFile(dryRun ? uploadedFile : null);
                const needsAttention = (Number(data.summary.partial) || 0) + (Number(data.summary.skipped) || 0);
                if (needsAttention > 0) {
                    notify(`${dryRun ? "Dry run" : "Tagging"} finished — ${needsAttention} ${needsAttention === 1 ? "row needs" : "rows need"} attention`, "warning");
                } else {
                    notify(dryRun ? "Dry run completed" : "Tagging applied", "success");
                }
            } catch (error) {
                if (error?.response?.status === 403) setDenied(true);
                const message = await errorMessage(error, dryRun ? "Validation failed" : "Applying tags failed");
                setRequestError(message);
                notify(message, "error");
            }
        });

    const isPreview = !!result && mode === "preview";
    const docsToUpdate = isPreview
        ? (Number(result.summary.updated) || 0) + (Number(result.summary.partial) || 0)
        : 0;
    const fieldsToClear = isPreview ? totalCleared(result.rows) : 0;
    const canApply = !!file && previewedFile === file && docsToUpdate > 0 && !busy;
    const applyHint = !file || previewedFile !== file
        ? "Validate this file with a dry run first"
        : docsToUpdate === 0
            ? "The dry run found nothing to change"
            : "";

    const confirmForm = () => (
        <div>
            <p className="mb-2">
                <strong>{docsToUpdate}</strong> {docsToUpdate === 1 ? "document" : "documents"} will be updated
                {fieldsToClear > 0 ? (
                    <>
                        , <strong className="text-warning-emphasis">{fieldsToClear}</strong>{" "}
                        {fieldsToClear === 1 ? "field" : "fields"} will be cleared
                    </>
                ) : null}
                . Continue?
            </p>
            <p className="text-muted small mb-3">
                File: <strong>{file?.name}</strong>. A summary report will be emailed to you.
            </p>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmOpen(false)}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => {
                        setConfirmOpen(false);
                        upload(false);
                    }}
                >
                    Apply tagging
                </button>
            </div>
        </div>
    );

    if (accessLoading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <CircularProgress size={26} />
            </div>
        );
    }

    if (!canView || denied) return <NoPageAccess />;

    return (
        <div className="client-onboarding-page">
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <DeleteModal
                deleteTitle={<h5 className="mb-0">Apply tagging</h5>}
                deleteForm={confirmForm}
                isModalOpen={confirmOpen}
                setIsModalOpen={setConfirmOpen}
            />

            <div className="service-tracker-inner-page-header d-lg-flex d-md-flex align-items-center">
                <div className="notification-page-title">
                    <h1>Bulk Document Tagging</h1>
                </div>
                <div className="ms-auto">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={handleDownloadTemplate}
                        disabled={!!busy}
                    >
                        {busy === "template" ? <CircularProgress size={14} /> : <Download size={16} />}
                        Download template
                    </button>
                </div>
            </div>

            <div className="bulk-tagging-layout">
                <div className="client-onboarding-panel">
                    <p className="text-muted small mb-3">
                        Tag many Document Repository files at once. Download the template, fill one row per document
                        with its doc_id and file_name plus the tags to set, then validate with a dry run before applying.
                    </p>

                    {canCreate ? (
                        <>
                            <FileDropzone
                                file={file}
                                accept={ACCEPTED_EXT}
                                disabled={!!busy}
                                onSelect={reset}
                                onRemove={() => reset(null)}
                                onError={(message) => notify(message, "error")}
                            />

                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                    onClick={() => upload(true)}
                                    disabled={!file || !!busy}
                                >
                                    {busy === "preview" && <CircularProgress size={14} color="inherit" />}
                                    Validate (dry run)
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={!canApply}
                                    title={applyHint}
                                >
                                    {busy === "apply" && <CircularProgress size={14} color="inherit" />}
                                    Apply tagging
                                </button>
                            </div>
                            {busy === "preview" || busy === "apply" ? (
                                <div className="text-muted small mt-2">
                                    Processing the file — large sheets can take a while, please keep this page open…
                                </div>
                            ) : applyHint && file && !busy ? (
                                <div className="text-muted small mt-2">{applyHint}.</div>
                            ) : null}
                        </>
                    ) : (
                        <div className="alert alert-secondary py-2 mb-0 small">
                            You have view-only access. Uploading requires create permission on Document Bulk Tagging.
                        </div>
                    )}

                    {requestError && <div className="alert alert-danger py-2 mt-3 mb-0">{requestError}</div>}
                </div>

                <div className="client-onboarding-panel">
                    <button
                        type="button"
                        className="client-onboarding-expander-toggle"
                        onClick={() => setRulesOpen((o) => !o)}
                        aria-expanded={rulesOpen}
                    >
                        <span className="fw-semibold">How rows are applied</span>
                        {rulesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {rulesOpen && (
                        <ul className="bulk-tagging-rules">
                            {RULES.map((rule) => (
                                <li key={rule}>{rule}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {result && <TaggingResults key={resultSeq.current} result={result} mode={mode} onReset={() => reset(null)} />}
        </div>
    );
};

export default DocumentBulkTagging;
