// Helpers shared by the spreadsheet bulk-upload pages (Client Onboarding, Document Bulk Tagging).

export const hasAllowedExtension = (file, extensions) => {
    const name = (file?.name || "").toLowerCase();
    return extensions.some((ext) => name.endsWith(ext));
};

export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const csvCell = (value) => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// rows: array of cell arrays, the first one being the header.
export const toCsv = (rows) => rows.map((cells) => cells.map(csvCell).join(",")).join("\r\n");

export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// Pulls the server's message out of an axios error; blob requests return their error body as a Blob.
export const apiErrorMessage = async (error, fallback, deniedMessage = "Access denied") => {
    const status = error?.response?.status;
    if (status === 403) return deniedMessage;
    if (status === 401) return "Your session has expired. Please log in again.";
    let data = error?.response?.data;
    if (data instanceof Blob) {
        try {
            data = JSON.parse(await data.text());
        } catch {
            data = null;
        }
    }
    return data?.message || fallback;
};
