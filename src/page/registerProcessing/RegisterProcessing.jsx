import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/registerProcessing.css";
import Mapping from "./Mapping";

function RegisterProcessing() {
  const [activeTab, setActiveTab] = useState("mapping");

  const [columns, setColumns] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mappings, setMappings] = useState( [
    ]);
  console.log(mappings,'mappings')
  const [isSaved, setIsSaved] = useState(false);
  const [loadedFromApi, setLoadedFromApi] = useState(false);
  const [tempPayload, setTempPayload] = useState(null);


  useEffect(() => {
    if (loadedFromApi) return;
    setIsSaved(false);
  }, [mappings, loadedFromApi]);


  // Save
  const handleSave = () => {
    if (!selectedFile) return alert("No file selected!");

    const payloadMappings = mappings.map((m) => ({
      target: m.Target,
      source: m.Source,
      default: m.Default || "",
      transform: m.Transform,
      ...(m.Transform === "raw" && m.Formula?.trim() && {
        formula: m.Formula.trim(),
      }),
      ...(m.Params && Object.keys(m.Params).length > 0 && { params: m.Params }),
    }));

    const payload = { filename: selectedFile.name, mappings: payloadMappings };
    setTempPayload(payload);
  };



  // Convert
  const handleConvert = async () => {
    if (!selectedFile) return alert("No file selected!");

    const payloadMappings = mappings.map((m) => ({
      target: m.Target,
      source: m.Source,
      default: m.Default || "",
      transform: m.Transform,
      ...(m.Transform === "raw" && m.Formula?.trim() && {
        formula: m.Formula.trim(),
      }),
      ...(m.Params && Object.keys(m.Params).length > 0 && { params: m.Params }),
    }));

    const payload = { filename: selectedFile.name, mappings: payloadMappings };

    let convertedFilename;

    try {
      const res = await axios.post(
        'http://192.168.1.225:9002' + "/v1/file/process",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      convertedFilename = res.data;
      alert("Converted successfully!");
      console.log("Converted file:", convertedFilename);
    } catch (err) {
      console.error("Conversion failed:", err);
      return alert("Conversion failed!");
    }

    try {
      const downloadPayload = { filepath: convertedFilename };
      const downloadResponse = await axios.post(
        'http://192.168.1.225:9002' + "/v1/file/download",
        downloadPayload,
        { headers: { "Content-Type": "application/json" }, responseType: "blob" }
      );
      console.log(downloadResponse.headers);

      // Get filename from headers
      let filename = "download.xlsx";
      const disposition = downloadResponse.headers["content-disposition"];

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert("Downloaded successfully!");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed!");
    }
  };


  // Clear everything
  const handleClear = () => {
    setColumns([]);
    setSelectedFile(null);
    setMappings([]);
    setIsSaved(false);
    setLoadedFromApi(false);
    setTempPayload(null);
  };


  const [availableMappingSets, setAvailableMappingSets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addMapping = () => {
    setMappings([
      ...mappings,
      {
        id: Date.now(),
        Target: "",
        Source: [],
        Transform: "",
        Formula: "",
        Params: {},
        Default: "",
      },
    ]);
    setLoadedFromApi(false); // any manual addition is not loaded from API
    setIsSaved(false);       // mark as unsaved
  };

  const updateMapping = (id, newMapping) => {
    setMappings(mappings.map((m) => (m.id === id ? newMapping : m)));
    setLoadedFromApi(false); // any manual change
    setIsSaved(false);       // mark as unsaved
  };

  const removeMapping = (id) => {
    setMappings(mappings.filter((m) => m.id !== id));
    setLoadedFromApi(false); // any manual change
    setIsSaved(false);       // mark as unsaved
  };


  const handleMappingSelect = (unique_id) => {
    const selectedSet = availableMappingSets.find((m) => m.unique_id === unique_id);
    if (selectedSet) {
      const newMappings = selectedSet.mappings.map((m) => ({
        id: Date.now() + Math.random(), // unique id for React keys
        Target: m.target || "",
        Source: m.source || [],
        Transform: m.transform || "",
        Formula: m.formula || "",
        Params: m.params || {},
        Default: m.default || "",
      }));
      setMappings(newMappings);
      setLoadedFromApi(true); // this mapping is loaded from API
      setIsSaved(true);       // loaded mapping is considered saved
    }
    setIsModalOpen(false);
  };


  return (
    <div className="app-container">
      {/* Tabs */}
      {columns.length > 0 && (
        <div className="tabs sticky-tabs">
          <button
            className={activeTab === "mapping" ? "active-tab" : ""}
            onClick={() => setActiveTab("mapping")}
          >
            Mapping
          </button>
          
        </div>
      )}
      <div className="service-tracker-inner-page-header d-lg-flex d-md-flex">
        <div className="notification-page-title">
          <div>
            <h1>Register Processing</h1>
          </div>
        </div>
        <div className="d-lg-flex d-md-flex gap-2 mt-2">
          <button className="crud_btn w-100 mb-2" onClick={addMapping}>
            <span className="button-style"> Add Mapping</span>
          </button>

        </div>
      </div>

      <div className="mapping-list-container">
        <div className="mapping-list-header">
          <h2>Mappings</h2>
          <div className="save-convert-container">
            <button
              className="crud_btn w-100"
              onClick={handleSave}
              disabled={isSaved || loadedFromApi}
            >
              Process
            </button>
            {/* <button
              className="button approve w-100 justify-content-center"
              onClick={handleConvert}
              disabled={!isSaved && !loadedFromApi}
            >
              Convert
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button> */}
          </div>
        </div>

        {mappings.map((mapping) => (
          <Mapping
            key={mapping.id}
            columns={columns}
            mapping={mapping}
            onChange={(newMapping) => updateMapping(mapping.id, newMapping)}
            onRemove={() => removeMapping(mapping.id)}
          />
        ))}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Select a Mapping Set</h3>
              <ul className="mapping-set-list">
                {availableMappingSets.map((set) => (
                  <li key={set.unique_id}>
                    <button onClick={() => handleMappingSelect(set.unique_id)}>
                      {set.unique_id}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterProcessing;
