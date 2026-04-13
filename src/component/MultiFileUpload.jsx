import { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MultiFileUpload({ uploadedFiles, setUploadedFiles,MAX_COUNT=5, MAX_SIZE_MB=5, setProgress,progress}) {
  const [dragActive, setDragActive] = useState(false);
  // const [progress, setProgress] = useState({});
  const inputRef = useRef();

  const validateFile = (file) => {
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      alert(`${file.name} exceeds ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const simulateUpload = (file) => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress((prev) => ({ ...prev, [file.name]: percent }));
      if (percent >= 100) clearInterval(interval);
    }, 200);
  };

  const handleFiles = (files) => {
    let updated = [...uploadedFiles];

    for (let file of files) {
      if (updated.length >= MAX_COUNT) {
        alert(`Max ${MAX_COUNT} files allowed`);
        break;
      }

      if (
        !updated.find((f) => f.name === file.name) &&
        validateFile(file)
      ) {
        updated.push(file);
        simulateUpload(file);
      }
    }

    setUploadedFiles(updated);
  };

  const handleInputChange = (e) => {
    handleFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (name) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.name !== name));
    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <div>
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          background: dragActive ? "#f0f8ff" : "#fff",
          cursor: "pointer",
        }}
      >
        <CloudUploadIcon fontSize="large" />
        <p>Drag & drop files here or click to upload</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleInputChange}
        />
      </div>

      {/* File List */}
      <div style={{ marginTop: 20 }}>
        {uploadedFiles.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              border: "1px solid #eee",
              padding: 10,
              borderRadius: 6,
            }}
          >
            {/* Preview */}
            <div style={{ width: 50, marginRight: 10 }}>
              {isImage(file) ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  style={{ width: "100%", borderRadius: 4 }}
                />
              ) : (
                <TextSnippetIcon />
              )}
            </div>

            {/* File Info */}
            <div style={{ flex: 1 }}>
              <div>{file.name}</div>

              {/* Progress Bar */}
              <div
                style={{
                  height: 6,
                  background: "#eee",
                  borderRadius: 4,
                  marginTop: 5,
                }}
              >
                <div
                  style={{
                    width: `${progress[file.name] || 0}%`,
                    height: "100%",
                    background: "#4caf50",
                    borderRadius: 4,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>

            {/* Remove */}
            <DeleteIcon
              onClick={() => removeFile(file.name)}
              style={{ cursor: "pointer", marginLeft: 10 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}