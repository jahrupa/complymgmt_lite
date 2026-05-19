import React, { useState, useRef, useCallback, useEffect } from "react";
import "../style/useRole.css";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import MuiTextField from "../component/MuiInputs/MuiTextField";
import MuiTextAreaField from "../component/MuiInputs/MuiTextAreaField";
import SmallSizeModal from "../component/SmallSizeModal";
import DeleteModal from "../component/DeleteModal";
import Snackbars from "../component/Snackbars";
import Toggle from "../component/Toggle";
import { AnimatedSearchBar } from "../component/AnimatedSearchBar";
import MultiSelectFilter from "./dashboardDrawerGridDetailPage/MultiSelectFilter";
import { flattenObject } from "../../Utils/tableColUtils";
import SingleSelectTextField from "../component/MuiInputs/SingleSelectTextField";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
    ModuleRegistry,
    AllCommunityModule,
} from "ag-grid-community";
import {
    bulkApproveAllPageData,
    createEntity,
    fetchAllCompanies,
    fetchAllEntities,
    deleteEntity,
    updateEntity,
    updateApprovalStatus,
} from "../api/service";
import { AppWindowMac } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const Entity = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState({
        _id: null,
        name: "",
        common_name: "",
        description: "",
        address: "",
        company_name: "",
        company_id: null,
    });
console.log(current,'current');
    const [isEditing, setIsEditing] = useState(false);
    console.log(isEditing, "isEditing");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [entityId, setEntityId] = useState(null);

    const [errors, setErrors] = useState({});

    const [filters, setFilters] = useState({});

    const [companyList, setCompanyList] = useState([]);

    const gridRef = useRef();

    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });

    // VALIDATION

    const validate = () => {
        let tempErrors = {};

        if (!current.name)
            tempErrors.name = "Name is required";

        if (!current.common_name)
            tempErrors.common_name = "Common name is required";

        if (!current.address)
            tempErrors.address = "Address is required";

        if (!current.company_id)
            tempErrors.company_name = "Company is required";

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    // HANDLE CHANGE

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrent((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };



    const openModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {

        const getCompanies = async () => {

            try {

                const response = await fetchAllCompanies();
                const entities = await fetchAllEntities() || [];

                setCompanyList(response || []);
                setData(entities);

            } catch (error) {

                console.log("Error fetching companies", error);

            }
        };

        getCompanies();

    }, []);

    const closeModal = () => {
        setIsModalOpen(false);

        setCurrent({
            _id: null,
            name: "",
            common_name: "",
            description: "",
            address: "",
            company_name: "",
            company_id: null,
        });

        setErrors({});

        setIsEditing(false);
    };

    // SUBMIT

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        const CommonAttributes = {
            IsActive: current.is_active !== undefined ? current.is_active : true,
        };
        const payload = {
            name: current.name || "",
            common_name: current.common_name || "",
            description: current.description || "",
            address: current.address || "",
            company_id: current.company_id || null,
        };
        const updateEntityPayload = {
            ...payload,
            common_attributes: CommonAttributes,
        };
        let response;
        try {
            if (isEditing) {
                response = await updateEntity(current.id, updateEntityPayload);

            } else {
                response = await createEntity(payload);
            }

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: response?.message || "Entity created successfully",
                severityType: "success",
            });

            const updatedData = await fetchAllEntities();
            setData(updatedData || []);

            closeModal();

        } catch (error) {

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message:
                    error?.response?.data?.message ||
                    "Failed to create entity",
                severityType: "error",
            });
        }
    };

    // DELETE

    const handleDelete = async () => {
        try {
            const response = await deleteEntity(entityId);

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: response?.message || "Entity deleted successfully",
                severityType: "success",
            });

            const updatedEntities = await fetchAllEntities();
            setData(updatedEntities || []);

            setIsDeleteModalOpen(false);

        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message || "Delete failed",
                severityType: "error",
            });
        }
    };

    // STATUS TOGGLE

    const handleToggleChange = (params) => {

        const updatedData = data.map((item) =>
            item._id === params.data._id
                ? {
                    ...item,
                    is_active: !item.is_active,
                }
                : item
        );

        setData(updatedData);
    };

    const generateDynamicColDefs = (data) => {

        if (!data || data.length === 0) return [];

        const sample = flattenObject(data[0]);

        const dynamicCols = Object.keys(sample)
            .map((key) => {
                if (key === "_id") return null;

                if (key === "common_attributes.Approval_Status") {

                    return {
                        field: key,
                        headerName: "Approval Status",
                        filter: true,
                        editable: false,
                        flex: 1,
                        minWidth: 180,

                        cellRenderer: (params) => {

                            const status = params.value ?? 0;

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
                                        checked={Number(status) === 1}
                                        disabled={status === 1}
                                        onChange={async () => {

                                            try {

                                                const response = await updateApprovalStatus(
                                                    params.data.id
                                                );

                                                setIsSnackbarsOpen({
                                                    ...issnackbarsOpen,
                                                    open: true,
                                                    message:
                                                        response?.message ||
                                                        "Entity approved successfully",
                                                    severityType: "success",
                                                });

                                                const updatedData = await fetchAllEntities();

                                                setData(updatedData || []);

                                            } catch (error) {

                                                setIsSnackbarsOpen({
                                                    ...issnackbarsOpen,
                                                    open: true,
                                                    message:
                                                        error?.response?.data?.message ||
                                                        "Approval failed",
                                                    severityType: "error",
                                                });
                                            }
                                        }}
                                        style={{
                                            width: 15,
                                            height: 15,
                                            accentColor: "orange",
                                            cursor:
                                                status === 1
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    />

                                    <span
                                        style={{
                                            color:
                                                status === 1
                                                    ? "green"
                                                    : "orange",
                                            fontSize: "0.8rem",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {status === 1
                                            ? "Approved"
                                            : "Pending"}
                                    </span>
                                </div>
                            );
                        },
                    };
                }
                if (key === "common_attributes.IsActive") {

                    return {
                        headerName: "Status",
                        field: key,
                        pinned: "right",
                        width: 140,
                        minWidth: 140,

                        cellRenderer: (params) => (
                            <Toggle
                                checked={params.value}
                                onChange={() =>
                                    handleToggleChange(params)
                                }
                            />
                        ),
                    };
                }

                return {
                    field: key,

                    headerName: key
                        .split(".")
                        .pop()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),

                    filter: true,
                    editable: false,
                    flex: 1,
                    minWidth: 150,

                    headerStyle: {
                        color: "#515151",
                        backgroundColor: "#ffffe24d",
                    },

                    valueGetter: (params) => {
                        return key
                            .split(".")
                            .reduce(
                                (acc, part) => acc?.[part],
                                params.data
                            );
                    },
                };
            })
            .filter(Boolean);


        // ACTION COLUMN

        return [
            {
                headerName: "Actions",
                field: "actions",
                pinned: "left",
                width: 130,
                filter: false,
                editable: false,
                cellStyle: {
                    backgroundColor: "rgb(252 229 205 / 64%)",
                },

                cellRenderer: (params) => (
                    <div className="d-flex justify-content-around align-items-center">
                        <button
                            className="btn btn-sm"
                            onClick={() => {

                                const matchedCompany = companyList.find(
                                    (company) =>
                                        company._id === params.data.company_id
                                );

                                setCurrent({
                                    ...params.data,
                                    company_name:
                                        matchedCompany?.company_name || "",
                                });

                                setIsEditing(true);
                                setIsModalOpen(true);
                                setEntityId(params.data.id);
                            }}
                        >
                            <EditIcon
                                fontSize="small"
                                className="action_icon"
                            />
                        </button>

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setEntityId(params.data.id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon
                                fontSize="small"
                                className="action_icon"
                            />
                        </button>

                    </div>
                ),
            },

            ...dynamicCols,
        ];
    };

    const handleApproveAll = async () => {

        try {

            const response =
                await bulkApproveAllPageData("entity");

            const message =
                response?.message ||
                "Status update successfully";

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: "success",
            });

        } catch (error) {

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message,
                severityType: "error",
            });
        }

        const updatedData = await fetchAllEntities();

        setData(updatedData || []);
    };

    // FILTER

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    const filteredRowData =
        Object.keys(filters).length === 0
            ? data
            : data.filter((row) => {
                return Object.entries(filters).every(
                    ([column, values]) => {
                        return values.includes(row[column]);
                    }
                );
            });

    // SEARCH

    const onFilterTextBoxChanged = useCallback(() => {

        gridRef.current.api.setGridOption(
            "quickFilterText",
            document.getElementById("filter-text-box").value
        );

    }, []);

    // DEFAULT COLUMN DEF

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: false,
        resizable: true,
        flex: 1,
        minWidth: 150,
    };

    // CRUD FORM

    const crudForm = () => {
        return (
            <div>

                <div className="d-lg-flex d-md-flex gap-3">

                    <MuiTextField
                        label="Name"
                        type="text"
                        fieldName="name"
                        handleChange={handleChange}
                        value={current.name}
                        error={!!errors.name}
                        helperText={errors.name}
                        isRequired={true}
                    />

                    <MuiTextField
                        label="Common Name"
                        type="text"
                        fieldName="common_name"
                        handleChange={handleChange}
                        value={current.common_name}
                        error={!!errors.common_name}
                        helperText={errors.common_name}
                        isRequired={true}
                    />

                </div>

                <MuiTextField
                    label="Description"
                    type="text"
                    fieldName="description"
                    handleChange={handleChange}
                    value={current.description}
                    error={!!errors.description}
                    helperText={errors.description}
                    isRequired={true}
                />

                <MuiTextField
                    label="Address"
                    type="text"
                    fieldName="address"
                    handleChange={handleChange}
                    value={current.address}
                    error={!!errors.address}
                    helperText={errors.address}
                    isRequired={true}
                />

                <SingleSelectTextField
                    name="company_name"
                    label="Company Name"
                    value={current.company_name}
                    onChange={(e) => {

                        const selectedCompany = e.target.value;

                        const matchedCompany = companyList.find(
                            (company) =>
                                company.company_name === selectedCompany
                        );

                        setCurrent((prev) => ({
                            ...prev,
                            company_name: selectedCompany,
                            company_id: matchedCompany?._id || null,
                        }));

                        setErrors((prev) => ({
                            ...prev,
                            company_name: "",
                        }));
                    }}
                    names={companyList.map((company) => ({
                        ...company,
                        name: company.company_name,
                    }))}
                    error={!!errors.company_name}
                    helperText={errors.company_name}
                />

                <div className="row row-gap-2 mt-3">

                    <div className="col-6">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                    </div>

                    <div className="col-6 d-flex justify-content-end">

                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Create Entity"}
                        </button>

                    </div>

                </div>

            </div>
        );
    };

    // DELETE MODAL

    const deleteModal = () => {
        return (
            <div>

                <div className="delete_message p-4">
                    Are you sure you want to delete <DeleteIcon className="action_icon" />{" "}
                    this entity?
                </div>

                <div className="row row-gap-2 mt-4">

                    <div className="col-6">

                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                setIsDeleteModalOpen(false)
                            }
                        >
                            Cancel
                        </button>

                    </div>

                    <div className="col-6 d-flex justify-content-end">

                        <button
                            className="btn btn-primary"
                            onClick={handleDelete}
                        >
                            Yes, I'm sure
                        </button>

                    </div>

                </div>

            </div>
        );
    };

    // RETURN UI

    return (
        <div>

            <div className="service-tracker-inner-page-header d-lg-flex d-md-flex">

                <div className="notification-page-title">

                    <h1>
                        {data?.length > 1
                            ? "Entities"
                            : "Entity"}
                    </h1>

                </div>

                <div className="d-lg-flex d-md-flex gap-2 mt-2">

                    <button
                        className="crud_btn w-100 mb-2"
                        onClick={openModal}
                    >
                        <span>
                            <AddIcon />
                        </span>

                        <span className="button-style">
                            Add New Entity
                        </span>

                    </button>

                    <div className="btn-wrap-div">

                        <button
                            className="button approve w-100 justify-content-center"
                            onClick={handleApproveAll}
                        >
                            <span className="text">
                                Approve
                            </span>
                        </button>

                    </div>

                </div>

            </div>

            {/* Snackbar */}

            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />

            {/* Delete Modal */}

            <DeleteModal
                deleteForm={deleteModal}
                deleteTitle="Delete Entity"
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
            />

            {/* CRUD MODAL */}

            <SmallSizeModal
                crudForm={crudForm}
                crudTitle="Add New Entity"
                editCrudTitle="Edit Entity"
                isEditing={isEditing}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                closeModal={closeModal}
            />

            {/* TABLE */}

            <div className="table_div p-3">

                <div className="d-flex align-items-center gap-2">

                    <AnimatedSearchBar
                        placeholder="Search..."
                        type="text"
                        id="filter-text-box"
                        onInput={onFilterTextBoxChanged}
                    />

                    <MultiSelectFilter
                        rowData={filteredRowData}
                        onFilterApply={handleFilterApply}
                    />

                </div>

                <div
                    className="ag-theme-quartz"
                    style={{
                        height: "75vh",
                        width: "100%",
                        marginTop: "1rem",
                    }}
                >

                    <AgGridReact
                        ref={gridRef}
                        theme="legacy"
                        rowData={filteredRowData}
                        columnDefs={generateDynamicColDefs(data)}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        rowSelection="single"
                        domLayout="normal"
                        headerHeight={45}
                        rowHeight={45}
                        animateRows={true}
                    />

                </div>

            </div>

        </div>
    );
};

export default Entity;