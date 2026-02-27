import React, { useCallback, useEffect, useRef, useState } from "react";
import "../style/useRole.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiTextField from "../component/MuiInputs/MuiTextField";
import AddIcon from "@mui/icons-material/Add";
import SmallSizeModal from "../component/SmallSizeModal";
import SingleSelectTextField from "../component/MuiInputs/SingleSelectTextField";
import {
  bulkApproveAllPageData,
  createCompany,
  deleteCompanyById,
  fetchAllCompanies,
  fetchAllGroupHolding,
  updateCompanyApprovalStatusById,
  updateCompanyById,
  updateCompanyStatusById,
} from "../api/service";
import DeleteModal from "../component/DeleteModal";
import Snackbars from "../component/Snackbars";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Toggle from "../component/Toggle";
import MuiTextAreaField from "../component/MuiInputs/MuiTextAreaField";
import { AnimatedSearchBar } from "../component/AnimatedSearchBar";
import { decryptData } from "./utils/encrypt";
import { flattenObject } from "../../Utils/tableColUtils";
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const Company = () => {
  // if you want to show dummy jason data
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({
    _id: null,
    company_name: "",
    company_description: "",
    group_name: "",
    group_holding_id: null,
    created_at: "",
    updated_at: "",
    company_common_name: "",
    company_size: "",
    company_industry: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupHoldingName, setGroupHoldingName] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const crudTitle = "Add New company";
  const editCrudTitle = "Edit company";
  const SystemUserId = decryptData(localStorage.getItem("user_id"));
  const gridRef = useRef();
  const [errors, setErrors] = useState({});
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });

  const validate = () => {
    let tempErrors = {};
    if (!current?.company_name)
      tempErrors.company_name = "Company name is required";
    if (!current?.company_common_name)
      tempErrors.company_common_name = "Company common name is required";
    if (!current?.group_name) tempErrors.group_name = "Group name is required";
    if (!current?.company_size)
      tempErrors.company_size = "Company size is required";
    if (!current?.company_industry)
      tempErrors.company_industry = "Company industry is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  const handleApproveAll = async () => {
    try {
      const response = await bulkApproveAllPageData("company");
      const message = response?.message || "Status update successfully";
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: "success",
      });
    } catch (error) {
      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: "error",
      });
    }
    const updatedData = await fetchAllCompanies();
    setData(updatedData);
  };
  // Handle Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Don't proceed if validation fails
    const CommonAttributes = {
      [isEditing ? "Updated_By" : "Created_By"]: SystemUserId || "",
    };
    const payload = {
      CompanyName: current?.company_name || "",
      CompanyDescription: current?.company_description || "",
      GroupHoldingsID: current?.group_holding_id || null,
      CompanyCommonName: current?.company_common_name || "",
      CommonAttributes: CommonAttributes,
      CompanySize: current?.company_size || "",
      CompanyIndustry: current?.company_industry || "",
    };

    try {
      let response;
      if (isEditing) {
        // Update existing company
        response = await updateCompanyById(companyId, payload);
      } else {
        // Create new company
        response = await createCompany(payload);
      }
      // ✅ Get the message from response
      const message = response?.message;
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: message,
        severityType: "success",
      });
      // Refresh data
      const updatedData = await fetchAllCompanies();
      setData(updatedData);
    } catch (error) {
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: "error",
      });
    }

    // Reset form state
    setCurrent({
      _id: null,
      company_name: "",
      group_name: "",
      company_description: "",
      group_holding_id: null,
      created_at: "",
      updated_at: "",
      company_common_name: "",
      company_size: "",
      company_industry: "",
    });

    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = async (companyId) => {
    try {
      const response = await deleteCompanyById(companyId);
      const message = response?.message || "Company deleted successfully";

      // Refresh data
      const updatedData = await fetchAllCompanies();
      setData(updatedData);
      setIsDeleteModalOpen(false);

      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: "success",
      });
    } catch (error) {
      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: "error",
      });
    }
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setCurrent({});
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [companiesRes, groupHoldingRes] = await Promise.allSettled([
        fetchAllCompanies(),
        fetchAllGroupHolding(),
      ]);

      if (companiesRes.status === "fulfilled") {
        setData(companiesRes.value);
      } else {
        // handle error silently
      }

      if (groupHoldingRes.status === "fulfilled") {
        const groupHolding = groupHoldingRes.value;
        if (groupHolding && groupHolding.length > 0) {
          setGroupHoldingName(groupHolding);
        }
      } else {
        // handle error silently
      }
    };

    fetchData();
  }, []);

  const crudForm = () => {
    return (
      <div>
        {/* <form onSubmit={handleSubmit}> */}

        <div className="fs-12 info mb-2">
          {" "}
          Company name must be at least 3 non-whitespace characters and must not
          be a duplicate.
        </div>
        <div className="d-lg-flex d-md-flex justify-content-between  gap-3">
          <MuiTextField
            label="Company Name"
            type="text"
            isRequired={true}
            fieldName="company_name"
            handleChange={handleChange}
            value={current.company_name}
            error={!!errors.company_name}
            helperText={errors.company_name}
          />
          <MuiTextField
            label="Company Comman Name"
            type="text"
            isRequired={true}
            fieldName="company_common_name"
            handleChange={handleChange}
            value={current.company_common_name}
            error={!!errors.company_common_name}
            helperText={errors.company_common_name}
          />
        </div>
        <SingleSelectTextField
          name="group_name"
          label="Group Holding"
          value={current.group_name}
          onChange={(e) => {
            const selectedName = e.target.value;
            const matchedGroup = groupHoldingName.find(
              (g) => g.name === selectedName,
            );
            setCurrent((prev) => ({
              ...prev,
              group_name: selectedName,
              group_holding_id: matchedGroup?._id || null,
            }));
            setErrors((prevErrors) => ({ ...prevErrors, group_name: "" }));
          }}
          names={groupHoldingName}
          error={!!errors.group_name}
          helperText={errors.group_name}
        />
        <div className="d-lg-flex d-md-flex justify-content-between  gap-3">
          <MuiTextField
            label="Company Size"
            type="text"
            isRequired={true}
            fieldName="company_size"
            handleChange={handleChange}
            value={current.company_size}
            error={!!errors.company_size}
            helperText={errors.company_size}
          />
          <MuiTextField
            label="Company Industry"
            type="text"
            isRequired={true}
            fieldName="company_industry"
            handleChange={handleChange}
            value={current.company_industry}
            error={!!errors.company_industry}
            helperText={errors.company_industry}
          />
        </div>
        <div>
          <MuiTextAreaField
            value={current.company_description}
            handleChange={handleChange}
            name="company_description"
            true
            label="Company Description"
          />
        </div>
        <div className="row row-gap-2">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              <span className="button-style">Cancel</span>
            </button>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {isEditing ? (
                <span className="button-style">Save Changes</span>
              ) : (
                <span className="button-style">Create company</span>
              )}
            </button>
          </div>
        </div>
        {/* </form> */}
      </div>
    );
  };

  const deleteModal = () => {
    return (
      <div>
        <div className="delete_message p-4">
          Are you sure you want to delete <DeleteIcon className="action_icon" />{" "}
          this company?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className="col-6">
            <button
              type="button"
              className="btn-sm btn btn-secondary"
              onClick={closeModal}
            >
              <span className="button-style">Cancel</span>
            </button>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <button
              type="submit"
              className="btn-sm btn btn-primary"
              onClick={() => handleDelete(companyId)}
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleToggleChange = async (e, params) => {
    const newIsActive = {
      IsActive: e.target.checked,
    };
    try {
      const response = await updateCompanyStatusById(
        params.data._id,
        newIsActive,
      );
      const message = response?.message || "Status update successfully";
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: "success",
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete company";

      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: errorMessage,
        severityType: "error",
      });
    }
    const updatedData = await fetchAllCompanies();
    setData(updatedData);
  };

  const handleCheckboxClick = async (rowId) => {
    const response = await updateCompanyApprovalStatusById(rowId);
    const message = response?.message;

    setIsSnackbarsOpen({
      ...issnackbarsOpen,
      open: true,
      message,
      severityType: "success",
    });

    const updatedData = await fetchAllCompanies();
    setData(updatedData);
  };

  const generateDynamicColDefs = (data) => {
    if (!data || data.length === 0) return [];

    const sample = flattenObject(data[0]);

    return Object.keys(sample)
      .map((key) => {
        // Skip unwanted fields
        if (
          key === "_id" ||
          key === "common_attributes.is_active" ||
          key === "common_attributes.is_deleted" ||
          key === "common_attributes.deleted_by" ||
          key === "common_attributes.deleted_at"
        )
          return null;

        // ✅ Special case for approval_status
        if (key === "common_attributes.approval_status") {
          return {
            field: key,
            headerName: "Approval Status",
            filter: true,
            editable: false,
            valueGetter: (params) =>
              params.data?.common_attributes?.approval_status,
            cellRenderer: (params) => {
              const status = params.value ?? 0;

              const handleChange = async (e) => {
                const checked = e.target.checked;

                // UI Update Immediately (Optimistic Update)
                params.node.setDataValue(
                  "common_attributes.approval_status",
                  checked ? 1 : 0,
                );

                // Optional: API Call
                try {
                  await handleCheckboxClick(params.data._id, checked ? 1 : 0);
                } catch  {
                  // Revert if API fails
                  params.node.setDataValue(
                    "common_attributes.approval_status",
                    status,
                  );
                }
              };

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={status === 1}
                    disabled={status === 1} // Approved hone ke baad disable
                    onChange={handleChange}
                    style={{
                      width: 15,
                      height: 15,
                      accentColor: "orange",
                      cursor: status === 1 ? "not-allowed" : "pointer",
                    }}
                  />
                  <span
                    style={{
                      color: status === 1 ? "green" : "orange",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {status === 1 ? "Approved" : "Pending"}
                  </span>
                </div>
              );
            },
          };
        }

        // ✅ Default column definition
        return {
          field: key,
          headerName: key
            .split(".")
            .pop()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),

          filter: true,
          editable: false,
          headerStyle: {
            color: "#515151",
            backgroundColor: "#ffffe24d",
          },

          valueGetter: (params) => {
            return key
              .split(".")
              .reduce((acc, part) => acc?.[part], params.data);
          },
        };
      })
      .filter(Boolean);
  };
  const colDefs = [
    {
      headerName: "Actions",
      field: "actions",
      pinned: "left",
      width: 130,
      filter: false,
      editable: false,
      cellStyle: { backgroundColor: "rgb(252 229 205 / 64%)" },
      cellRenderer: (params) => (
        <div className="d-flex justify-content-around align-items-center">
          <button
            className="btn btn-sm"
            onClick={() => {
              setCurrent(params.data);
              setIsEditing(true);
              setIsModalOpen(true);
              setCompanyId(params.data._id);
            }}
          >
            <EditIcon fontSize="small" className="action_icon" />
          </button>

          <button
            className="btn btn-sm"
            onClick={() => {
              setCompanyId(params.data._id);
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" className="action_icon" />
          </button>
        </div>
      ),
    },

    ...generateDynamicColDefs(data),

    {
      headerName: "Status",
      field: "common_attributes.is_active",
      pinned: "right",
      valueGetter: (params) => params.data?.common_attributes?.is_active,
      cellRenderer: (params) => (
        <Toggle
          checked={!!params.value}
          onChange={(e) => handleToggleChange(e, params)}
        />
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
  };

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);

  return (
    <div>
      <div className="service-tracker-inner-page-header d-lg-flex d-md-flex">
        <div className="notification-page-title">
          <div>
            <h1>{data?.length > 1 ? "Companies" : "Company"}</h1>
          </div>
        </div>
        <div className="d-lg-flex d-md-flex gap-2 mt-2">
          <button className="crud_btn w-100 mb-2" onClick={openModal}>
            <span>
              <AddIcon />
            </span>{" "}
            <span className="button-style">Add New Company</span>
          </button>
          <div className="btn-wrap-div">
            <button
              className="button approve w-100 justify-content-center"
              onClick={() => handleApproveAll()}
            >
              <span className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                </svg>
              </span>
              <span className="text">Approve</span>
            </button>
          </div>
        </div>
      </div>
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
      <DeleteModal
        deleteForm={deleteModal}
        deleteTitle="Delete Company"
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
      />
      <SmallSizeModal
        crudForm={crudForm}
        crudTitle={crudTitle}
        isEditing={isEditing}
        editCrudTitle={editCrudTitle}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        closeModal={closeModal}
      />
      <div className="table_div p-3">
        <div className="d-lg-flex d-md-flex  justify-content-between">
          <AnimatedSearchBar
            placeholder="Search..."
            type="text"
            id="filter-text-box"
            onInput={onFilterTextBoxChanged}
          />
        </div>
        <div
          className="ag-theme-quartz"
          style={{ height: "600px", width: "100%", marginTop: "1rem" }}
        >
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={data}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            editType="fullRow"
            rowSelection="single"
            pagination={true}
          // rowBuffer={rowBuffer}
          // onRowValueChanged={onRowValueChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default Company;
