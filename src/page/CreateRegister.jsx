import React, { useState } from 'react'
import MuiTextField from '../component/MuiInputs/MuiTextField';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';

const CreateRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    template_path: "",
    type: "",
    headers: [""]
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle header change
  // Header change
  const handleHeaderChange = (index, value) => {
    const updatedHeaders = [...formData.headers];
    updatedHeaders[index] = value;

    setFormData((prev) => ({
      ...prev,
      headers: updatedHeaders
    }));
  };

  // Add header
  const addHeader = () => {
    setFormData((prev) => ({
      ...prev,
      headers: [...prev.headers, ""]
    }));
  };

  // Remove header
  const removeHeader = (index) => {
    const updatedHeaders = formData.headers.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      headers: updatedHeaders
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      state: formData.state,
      headers: formData.headers,
      template_path: formData.template_path,
      type: formData.type
    };

    console.log("Payload:", payload);

    // Example API call
    fetch("/api/save-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => console.log("Success:", data))
      .catch((err) => console.error("Error:", err));
  };
  const fileType = [
    { name: "File", value: "file" },
    { name: "Hybrid", value: "hybrid" },
    { name: "Individual", value: "individual" },
  ];
  return (
    <div className="app-container">
      <div className="service-tracker-inner-page-header d-flex justify-content-between">
        <h1>Create Register</h1>
      </div>
      <div className='mapping-container'>
        <div className="mapping-containerd-lg-flex d-md-flex gap-3">
          <MuiTextField
            label="Name"
            type="text"
            isRequired={true}
            fieldName="name"
            handleChange={handleChange}
          // value={formData.name}
          // error={!!errors.name}
          // helperText={errors.name}
          />
          <MuiTextField
            label="State"
            type="text"
            isRequired={true}
            fieldName="state"
            handleChange={handleChange}
          // value={formData.state}
          // error={!!errors.state}
          // helperText={errors.state}
          />
          <MuiTextField
            label="Template Path"
            type="text"
            isRequired={true}
            fieldName="template_path"
            handleChange={handleChange}
          // value={formData.template_path}
          // error={!!errors.template_path}
          // helperText={errors.template_path}
          />
          <SingleSelectTextField
            name="type"
            label="Type"
            value={formData.type}
            onChange={(e) => {
              const selectedName = e.target.value;
              setFormData((prev) => ({
                ...prev,
                type: selectedName,

              }));
            }}
            names={fileType.map((item) => ({
              _id: item.value,
              name: item.name,
            }))}
          // error={!!errors.type}
          // helperText={errors.type}
          />
        </div>
        <div className="mapping-container d-lg-flex d-md-flex gap-3 flex-column">
          <div className='d-lg-flex d-md-flex align-content-center align-items-center justify-content-between'>
            <label className="fw-bold">Headers</label>

            <button
              type="button"
              className="btn btn-success"
              onClick={addHeader}
            >
              ➕ Add Header
            </button>
          </div>

          {formData.headers.map((header, index) => (
            <div key={index} className="d-flex gap-2 align-items-center w-100">

              <MuiTextField
                label={`Header ${index + 1}`}
                type="text"
                isRequired={true}
                fieldName={`header-${index}`}
                value={header}
                handleChange={(e) => handleHeaderChange(index, e.target.value)}
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeHeader(index)}
              >
                ❌
              </button>
            </div>
          ))}


        </div>

      </div>

      {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Form Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />

        <input
          type="text"
          name="template_path"
          placeholder="Template Path"
          value={formData.template_path}
          onChange={handleChange}
        />

        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="file">File</option>
          <option value="text">Text</option>
        </select>

        <div className="headers-section">
          <h4>Headers</h4>

          {formData.headers.map((header, index) => (
            <div key={index} className="header-row">
              <input
                type="text"
                placeholder={`Header ${index + 1}`}
                value={header}
                onChange={(e) =>
                  handleHeaderChange(index, e.target.value)
                }
              />

              <button
                type="button"
                className="remove-btn"
                onClick={() => removeHeader(index)}
              >
                ❌
              </button>
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addHeader}>
            ➕ Add Header
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form> */}
    </div>
  )
}

export default CreateRegister