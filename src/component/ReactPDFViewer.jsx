import React, { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { downloadFile } from "../api/service";
import "../style/documentPreview.css";

// The download API streams bytes without a usable Content-Type, so the mime type
// is derived from the file name before handing the blob to an iframe/img.
const MIME_BY_EXT = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
};

const KIND_BY_EXT = {
  pdf: "pdf",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  svg: "image",
  xlsx: "sheet",
  xlsm: "sheet",
  xls: "sheet",
  csv: "sheet",
  docx: "docx",
  txt: "text",
  json: "text",
  xml: "text",
  log: "text",
};

const extensionOf = (name = "") =>
  name.includes(".") ? name.split(".").pop().toLowerCase() : "";

// The spreadsheet/Word renderers are heavy and rarely needed, so they are pulled
// in only when such a file is actually previewed (import() results are cached).
const loadXlsx = () => import("xlsx");
const loadDocxPreview = () => import("docx-preview");

export const ReactPDFViewer = ({ documentId, fileName = "" }) => {
  const ext = extensionOf(fileName);
  const kind = KIND_BY_EXT[ext] || "unsupported";

  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [objectUrl, setObjectUrl] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState("");
  const [sheetHtml, setSheetHtml] = useState("");
  const docxRef = useRef(null);

  useEffect(() => {
    setError("");
    setActionError("");
    setObjectUrl(null);
    setBuffer(null);
    setTextContent("");
    setWorkbook(null);
    setActiveSheet("");
    setSheetHtml("");

    if (!documentId) {
      setStatus("idle");
      return;
    }

    // Nothing to render for unsupported types, so skip the download entirely and
    // let the fallback card offer it on demand instead.
    if (kind === "unsupported") {
      setStatus("ready");
      return;
    }

    let cancelled = false;
    let createdUrl = null;
    setStatus("loading");

    (async () => {
      try {
        const blob = await downloadFile(documentId);
        if (cancelled) return;

        if (kind === "pdf" || kind === "image") {
          createdUrl = URL.createObjectURL(
            new Blob([blob], { type: MIME_BY_EXT[ext] }),
          );
          setObjectUrl(createdUrl);
        } else if (kind === "sheet") {
          const XLSX = await loadXlsx();
          const wb = XLSX.read(await blob.arrayBuffer(), { type: "array" });
          if (cancelled) return;
          setWorkbook(wb);
          setActiveSheet(wb.SheetNames?.[0] || "");
        } else if (kind === "docx") {
          const buf = await blob.arrayBuffer();
          if (cancelled) return;
          setBuffer(buf);
        } else if (kind === "text") {
          const content = await blob.text();
          if (cancelled) return;
          setTextContent(content);
        }

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.status === 404
            ? "This file is no longer available on the server."
            : "Unable to load this document.",
        );
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [documentId, ext, kind]);

  // docx-preview writes straight into a DOM node, so it runs once the container
  // for this document is mounted.
  useEffect(() => {
    if (kind !== "docx" || !buffer || !docxRef.current) return;

    let cancelled = false;
    const container = docxRef.current;
    container.innerHTML = "";

    loadDocxPreview()
      .then(({ renderAsync }) =>
        renderAsync(buffer, container, null, {
          inWrapper: false,
          ignoreWidth: true,
          ignoreHeight: true,
        }),
      )
      .catch(() => {
        if (cancelled) return;
        setError("Unable to render this Word document.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [kind, buffer]);

  useEffect(() => {
    if (kind !== "sheet" || !workbook || !activeSheet) return;

    let cancelled = false;
    (async () => {
      const XLSX = await loadXlsx();
      if (cancelled) return;
      setSheetHtml(
        XLSX.utils.sheet_to_html(workbook.Sheets[activeSheet], {
          editable: false,
          header: "",
          footer: "",
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [kind, workbook, activeSheet]);

  const handleDownload = async () => {
    setActionError("");
    try {
      const blob = await downloadFile(documentId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setActionError("Download failed. Please try again.");
    }
  };

  const renderBody = () => {
    if (status === "idle")
      return (
        <div className="doc-preview__state">
          <FilePresentIcon style={{ color: "deepskyblue" }} />
          <span>Select a document to preview.</span>
        </div>
      );

    if (status === "loading")
      return (
        <div className="doc-preview__state">
          <CircularProgress size={26} />
          <span>Loading preview…</span>
        </div>
      );

    if (status === "error")
      return (
        <div className="doc-preview__state">
          <span className="doc-preview__error">{error}</span>
          <span className="doc-preview__file-name">{fileName}</span>
        </div>
      );

    if (kind === "pdf")
      return (
        <iframe
          className="doc-preview__frame"
          src={objectUrl}
          title={fileName || "Document preview"}
        />
      );

    if (kind === "image")
      return (
        <img
          className="doc-preview__image"
          src={objectUrl}
          alt={fileName || "Document preview"}
        />
      );

    if (kind === "sheet")
      return (
        <div
          className="doc-preview__sheet"
          dangerouslySetInnerHTML={{ __html: sheetHtml }}
        />
      );

    if (kind === "docx")
      return <div className="doc-preview__docx" ref={docxRef} />;

    if (kind === "text")
      return <pre className="doc-preview__text">{textContent}</pre>;

    return (
      <div className="doc-preview__state">
        <FilePresentIcon style={{ color: "deepskyblue" }} />
        <span>
          Preview is not available for {ext ? `.${ext}` : "this"} files.
        </span>
        <span className="doc-preview__file-name">{fileName}</span>
      </div>
    );
  };

  const sheetNames = workbook?.SheetNames || [];

  return (
    <div className="doc-preview">
      {kind === "sheet" && sheetNames.length > 1 && (
        <div className="doc-preview__tabs">
          {sheetNames.map((name) => (
            <button
              key={name}
              type="button"
              className={`doc-preview__tab ${
                name === activeSheet ? "doc-preview__tab--active" : ""
              }`}
              onClick={() => setActiveSheet(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="doc-preview__body">{renderBody()}</div>

      <div className="doc-preview__footer">
        <span className="doc-preview__file-name">{fileName}</span>
        <div className="d-flex align-items-center gap-2">
          {actionError && (
            <span className="doc-preview__error">{actionError}</span>
          )}
          {documentId && (
            <button
              type="button"
              className="doc-preview__download"
              onClick={handleDownload}
            >
              <Download style={{ height: "16px", width: "16px" }} />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
