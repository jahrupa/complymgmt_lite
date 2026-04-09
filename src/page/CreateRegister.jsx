import React, { useState } from 'react'
import MuiTextField from '../component/MuiInputs/MuiTextField';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import { createRegister } from '../api/service';
import Snackbars from '../component/Snackbars';
import DeleteIcon from "@mui/icons-material/Delete";

const CreateRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    template_path: "",
    type: "",
    headers: [""]
  });
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
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

  // Submit formasync 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      state: formData.state,
      headers: formData.headers,
      template_path: formData.template_path,
      type: formData.type
    };
    try {
      let response;
      // Create new company
      response = await createRegister(payload);
      // ✅ Get the message from response
      const message = response?.message;
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });
      setFormData({
        name: "",
        state: "",
        template_path: "",
        type: "",
        headers: [""]
      });
    } catch (error) {
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: error?.response?.data?.message, severityType: 'error' });
    }
  };
  const fileType = [
    { name: "File", value: "file" },
    { name: "Hybrid", value: "hybrid" },
    { name: "Individual", value: "individual" },
  ];
  return (
    <div className="app-container">
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
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
        <div className="mapping-container d-lg-flex d-md-flex gap-3 flex-column" style={{ maxHeight: 504, overflow: 'auto' }}>
          <div className='d-lg-flex d-md-flex align-content-center align-items-center justify-content-between'>
            <label className="fw-bold">Headers</label>

            <button
              type="button"
              
              className="btn btn-primary"
              onClick={addHeader}
            >
              + Add Header
            </button>
          </div>

          {formData.headers.map((header, index) => (
            <div key={index} className="d-flex gap-2 align-items-center w-100" >

              <MuiTextField
                label={`Header ${index + 1}`}
                type="text"
                isRequired={true}
                fieldName={`header-${index}`}
                value={header}
                handleChange={(e) => handleHeaderChange(index, e.target.value)}
              />
              <div className='pb-3'>
                <button
                  type="button"
                  className="btn"
                  onClick={() => removeHeader(index)}
                >
                   <DeleteIcon fontSize="small"style={{fontSize:20,color:'#0a5881'}} />
                </button>
              </div>

            </div>
          ))}


        </div>
        <div className="row row-gap-2 mt-3 justify-content-lg-end justify-content-md-end justify-content-center">
          <div className="col-12 col-md-6 w-auto">
            <button type="button" className="btn btn-secondary w-100" >Cancel</button>
          </div>
          <div className="col-12 col-md-6 w-auto">
            <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit} >Save</button>
          </div>
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