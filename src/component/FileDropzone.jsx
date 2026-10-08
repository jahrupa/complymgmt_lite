import React, { useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import "../style/clientOnboardingUpload.css";
import { formatFileSize, hasAllowedExtension } from "../page/utils/bulkUpload";

/**
 * Single-file drag & drop / file picker used by the bulk-upload pages, plus the
 * selected-file row with a remove button. Only the extension is checked here.
 */
const FileDropzone = ({ file, accept, disabled, onSelect, onRemove, onError }) => {
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const pick = (picked) => {
        if (disabled || !picked) return;
        if (!hasAllowedExtension(picked, accept)) {
            onError(`Unsupported file type. Please upload a ${accept.join(", ")} file.`);
            return;
        }
        onSelect(picked);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (disabled) return;
        if (e.dataTransfer.files.length > 1) {
            onError("Please upload one file at a time.");
            return;
        }
        pick(e.dataTransfer.files[0]);
    };

    return (
        <>
            <div
                className={`client-onboarding-dropzone ${dragOver ? "drag-over" : ""} ${disabled ? "disabled" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click();
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <UploadCloud size={32} className="mb-2" />
                <div>
                    <strong>Click to choose a file</strong> or drag and drop it here
                </div>
                <div className="text-muted small">{accept.join(", ")} — one file at a time</div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(",")}
                    hidden
                    onChange={(e) => {
                        pick(e.target.files?.[0]);
                        e.target.value = ""; // allow picking the same file again after removing it
                    }}
                />
            </div>

            {file && (
                <div className="client-onboarding-file">
                    <FileSpreadsheet size={20} />
                    <div className="client-onboarding-file-name" title={file.name}>
                        {file.name}
                        <span className="text-muted small ms-2">{formatFileSize(file.size)}</span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={onRemove}
                        disabled={disabled}
                        aria-label="Remove file"
                        title="Remove file"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </>
    );
};

export default FileDropzone;
