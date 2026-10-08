import React, { useCallback, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Download } from "lucide-react";
import "../../style/clientOnboardingUpload.css";
import { downloadClientOnboardingTemplate, uploadClientOnboardingFile } from "../../api/service";
import Snackbars from "../../component/Snackbars";
import DeleteModal from "../../component/DeleteModal";
import FileDropzone from "../../component/FileDropzone";
import { usePageAccess } from "../utils/usePageAccess";
import OnboardingResults from "./OnboardingResults";
import { apiErrorMessage, downloadBlob } from "../utils/bulkUpload";
import { ACCEPTED_EXT, totalCreated } from "./onboardingUtils";

const errorMessage = (error, fallback) =>
    apiErrorMessage(error, fallback, "Access denied — you don't have permission for client onboarding.");

/**
 * Client Onboarding: bulk-create groups, companies, entities, locations, modules and
 * sub-modules from a spreadsheet. Preview (dry run) first, then confirm to import the same file.
 */
const ClientOnboarding = () => {
    const { loading: accessLoading, canView, canCreate } = usePageAccess("client_onboarding");

    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(null); // "template" | "preview" | "import" | null
    const busyRef = useRef(false);

    const [result, setResult] = useState(null);
    const [mode, setMode] = useState(null); // "preview" | "import"
    const [previewedFile, setPreviewedFile] = useState(null);
    const [requestError, setRequestError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

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

    const selectFile = (picked) => {
        if (busyRef.current) return;
        setFile(picked);
        setResult(null);
        setMode(null);
        setPreviewedFile(null);
        setRequestError("");
    };

    const removeFile = () => {
        if (busyRef.current) return;
        setFile(null);
        setResult(null);
        setMode(null);
        setPreviewedFile(null);
        setRequestError("");
    };

    const handleDownloadTemplate = () =>
        runExclusive("template", async () => {
            try {
                const blob = await downloadClientOnboardingTemplate();
                downloadBlob(blob, "client_onboarding_template.xlsx");
                notify("Template downloaded", "success");
            } catch (error) {
                notify(await errorMessage(error, "Could not download the template"), "error");
            }
        });

    const upload = (dryRun) =>
        runExclusive(dryRun ? "preview" : "import", async () => {
            const uploadedFile = file;
            setRequestError("");
            try {
                const data = await uploadClientOnboardingFile(uploadedFile, dryRun);
                setResult(data);
                setMode(dryRun ? "preview" : "import");
                // A preview unlocks import for this exact file; after an import it has to be previewed again.
                setPreviewedFile(dryRun ? uploadedFile : null);
                if (data?.errors?.length) {
                    notify(`${dryRun ? "Preview" : "Import"} finished — some rows have errors and were skipped`, "warning");
                } else {
                    notify(dryRun ? "Preview ready" : "Import completed", "success");
                }
            } catch (error) {
                const message = await errorMessage(error, dryRun ? "Preview failed" : "Import failed");
                setRequestError(message);
                notify(message, "error");
            }
        });

    const createCount = result && mode === "preview" ? totalCreated(result.summary) : 0;
    const canConfirm = !!file && previewedFile === file && createCount > 0 && !busy;

    const confirmForm = () => (
        <div>
            <p className="mb-3">
                This will create <strong>{createCount}</strong> {createCount === 1 ? "record" : "records"} from{" "}
                <strong>{file?.name}</strong>. Continue?
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
                    Import
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

    if (!canView) {
        return (
            <div className="client-onboarding-page">
                <div className="alert alert-warning mt-3">You don't have access to this page.</div>
            </div>
        );
    }

    return (
        <div className="client-onboarding-page">
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <DeleteModal
                deleteTitle={<h5 className="mb-0">Confirm import</h5>}
                deleteForm={confirmForm}
                isModalOpen={confirmOpen}
                setIsModalOpen={setConfirmOpen}
            />

            <div className="service-tracker-inner-page-header d-lg-flex d-md-flex align-items-center">
                <div className="notification-page-title">
                    <h1>Client Onboarding</h1>
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

            <div className="client-onboarding-layout">
                <div className="client-onboarding-panel">
                    <p className="text-muted small mb-3">
                        Download the template, fill one row per location / module / sub-module, and upload. Records are
                        matched by exact name: existing groups, companies, entities, locations, modules and sub-modules
                        are reused, and missing ones are created. Required columns: group_name, company_name,
                        entity_name, location_name, state, module_name.
                    </p>

                    {canCreate ? (
                        <>
                            <FileDropzone
                                file={file}
                                accept={ACCEPTED_EXT}
                                disabled={!!busy}
                                onSelect={selectFile}
                                onRemove={removeFile}
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
                                    Preview
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={!canConfirm}
                                    title={canConfirm ? "" : "Preview this file first"}
                                >
                                    {busy === "import" && <CircularProgress size={14} color="inherit" />}
                                    Confirm &amp; import
                                </button>
                            </div>
                            {busy === "preview" || busy === "import" ? (
                                <div className="text-muted small mt-2">
                                    Processing the file — this can take a few seconds for large files…
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="alert alert-secondary py-2 mb-0 small">
                            You have view-only access. Uploading requires create permission on Client Onboarding.
                        </div>
                    )}

                    {requestError && <div className="alert alert-danger py-2 mt-3 mb-0">{requestError}</div>}
                </div>

                {result && <OnboardingResults key={mode} result={result} mode={mode} />}
            </div>
        </div>
    );
};

export default ClientOnboarding;
