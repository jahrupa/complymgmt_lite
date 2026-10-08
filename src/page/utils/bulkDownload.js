import { downloadFile } from "../../api/service";

// Parallel requests to the single-file download API; enough to be quick
// without flooding the server with one request per selected row.
const CONCURRENCY = 4;

// Two documents with the same file name would overwrite each other in the zip,
// so later ones get a " (1)", " (2)" ... suffix before the extension.
const uniqueName = (name, used) => {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 1;
  while (used.has(`${base} (${i})${ext}`)) i++;
  const unique = `${base} (${i})${ext}`;
  used.add(unique);
  return unique;
};

/**
 * Downloads every document through the existing single-file API and packs
 * them into one zip.
 *
 * @param docs        [{ document_id, file_name }]
 * @param onProgress  (done, total) after each file finishes (ok or failed)
 * @returns { zip: Blob | null, failed: docs[] }  zip is null if nothing succeeded
 */
export const zipDocuments = async (docs, onProgress) => {
  // Loaded on demand so JSZip isn't part of the main bundle
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const usedNames = new Set();
  const failed = [];
  let next = 0;
  let done = 0;

  const worker = async () => {
    while (next < docs.length) {
      const doc = docs[next++];
      try {
        const blob = await downloadFile(doc.document_id);
        const name = uniqueName(
          doc.file_name || `document_${doc.document_id}`,
          usedNames,
        );
        zip.file(name, blob);
      } catch {
        failed.push(doc);
      }
      onProgress?.(++done, docs.length);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, docs.length) }, worker),
  );

  if (failed.length === docs.length) return { zip: null, failed };
  return { zip: await zip.generateAsync({ type: "blob" }), failed };
};
