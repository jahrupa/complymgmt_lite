import React, { useCallback, useEffect, useMemo, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Toggle from '../component/Toggle';
import { flattenObject } from '../../Utils/tableColUtils';
import { createApplicability, createMapping, deleteApplicabilityById, fetchAllFiles, fetchAllGroupHolding, fetchAllLocationName, fetchAllRegisterNames, fetchCompaniesNameByGroupId, getApplicabilityByCompanyId, getApplicabilityByGroupId, getApplicabilityByLocationId, getLocationByCompanyId, updateApplicabilityById, uploadFileGolang } from '../api/service'
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField'
import { AgGridReact } from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import MultiFileUpload from '../component/MultiFileUpload';
import SmallSizeModal from '../component/SmallSizeModal';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import { useRef } from 'react';
import MultiSelectFilter from './dashboardDrawerGridDetailPage/MultiSelectFilter';
import { Plus } from 'lucide-react';
import RegisterMappingPage from './RegisterMappingPage';
import Snackbars from '../component/Snackbars';


ModuleRegistry.registerModules([AllCommunityModule]);

const RegisterProcessingViewPage = () => {
    const [groupHoldingName, setGroupHoldingName] = useState([])
    const [companyName, setCompanyName] = useState([])
    const [locationNameByCompanyId, setLocationNameByCompanyId] = useState([])
    const [locationName, setLocationName] = useState([])
    const [registerName, setRegisterName] = useState([]);
    const [current, setCurrent] = useState(
        {
            group_name: "",
            group_holding_id: null,
            company_name: "",
            company_id: null,
            location_name: "",
            location_id: null,
            applicability_id: null,
            register_id: null,
            register_name: "",
        });
    const [applicabilityModal, setApplicabilityModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const [dataById, setDataById] = useState({
        applicabilityByLocationId: [],
        applicabilityByCompanyId: [],
        applicabilityByGroupId: [],
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [source, setSource] = useState(null);
    const [steps, setSteps] = useState([]);

    const gridRef = useRef();

    const [filteredData, setFilteredData] = useState([]);

    const handleFilterApply = (data) => {
        setFilteredData(data);
    };


    // "location" | "company" | "group"
    // const [columnDefs, setColumnDefs] = useState([]);
    const data = useMemo(() => {
        if (source === "location") {
            return dataById.applicabilityByLocationId;
        } else if (source === "company") {
            return dataById.applicabilityByCompanyId;
        } else if (source === "group") {
            return dataById.applicabilityByGroupId;
        } else {
            return [];
        }
    }, [source, dataById]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllGroupHolding();
                setGroupHoldingName(data);
                const locationNameData = await fetchAllLocationName();
                setLocationName(locationNameData || []);
                const registerNameData = await fetchAllRegisterNames();
                setRegisterName(registerNameData || []);
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchCompany = async () => {
            const data = await fetchCompaniesNameByGroupId(current?.group_holding_id);
            const applicabilityByGroupId = await getApplicabilityByGroupId(current?.group_holding_id);

            setCompanyName(data || []);
            setDataById(prev => ({
                ...prev,
                applicabilityByGroupId: applicabilityByGroupId || []
            }));

            setSource("group");
        };

        if (current?.group_holding_id) {
            fetchCompany();
        } else {
            // 🔥 Group None case
            setSource(null);
            setCompanyName([]);
            setLocationNameByCompanyId([]);
            setDataById(prev => ({
                ...prev,
                applicabilityByGroupId: [],
                applicabilityByCompanyId: [],
                applicabilityByLocationId: []
            }));
        }
    }, [current?.group_holding_id]);

    useEffect(() => {
        const fetchLocationByCompanyId = async () => {
            try {
                const data = await getLocationByCompanyId(current?.company_id);
                const applicabilityByCompanyId = await getApplicabilityByCompanyId(current?.company_id);
                if (data) {
                    setLocationNameByCompanyId(data);
                    setDataById((prev) => ({ ...prev, applicabilityByCompanyId: applicabilityByCompanyId || [] }));
                    setSource("company");
                }
            } catch {
                setDataById((prev) => ({ ...prev, applicabilityByCompanyId: [] }));
                // console.error("Failed to fetch location by company_id:", error);
            }
        };

        if (current?.company_id) {
            fetchLocationByCompanyId();
        }
    }, [current?.company_id]);

    useEffect(() => {
        const fetchApplicabilityByLocationId = async () => {
            try {
                const data = await getApplicabilityByLocationId(current?.location_id);

                setDataById((prev) => ({
                    ...prev,
                    applicabilityByLocationId: data || []
                }));

                setSource("location");
            } catch {
                setDataById((prev) => ({
                    ...prev,
                    applicabilityByLocationId: []
                }));
                // setSource("");
            }
        };

        if (current?.location_id) {
            fetchApplicabilityByLocationId();
        }
    }, [current?.location_id]);

    const generateDynamicColDefs = (data) => {
        if (!data || data.length === 0) return [];

        const sample = flattenObject(data[0]);

        return Object.keys(sample)
            .map((key) => {
                if (
                    key === "_id" ||
                    key === "common_attributes.is_deleted" ||
                    key === "common_attributes.deleted_by" ||
                    key === "common_attributes.deleted_at"
                )
                    return null;

                return {
                    field: key,
                    headerName: key
                        .split(".")
                        .pop()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                    filter: true,
                    editable: false,
                    valueGetter: (params) => {
                        return key
                            .split(".")
                            .reduce((acc, part) => acc?.[part], params.data);
                    },
                };
            })
            .filter(Boolean);
    };


    const handleDelete = async (row) => {
        try {
            const result = await deleteApplicabilityById(row);
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: result?.message || "Applicability deleted successfully!",
                severityType: "success",
            });
        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message || "Failed to delete applicability.",
                severityType: "error",
            });
        }
    };

    const actionCol = {
        headerName: 'Actions',
        field: 'actions',
        width: 120,
        pinned: 'left',
        cellStyle: { backgroundColor: 'rgb(252 229 205 / 64%)' },
        cellRenderer: (params) => (
            <div
                className="d-flex justify-content-around align-items-center"
                style={{ height: "100%", width: "100%" }}
            >
                <EditIcon
                    fontSize="small"
                    style={{ cursor: "pointer" }}
                    className="action_icon"
                    onClick={() => {
                        setIsEditing(true);
                        setApplicabilityModal(true);
                        setCurrent((prev) => ({ ...prev, applicability_id: params.data.applicability_id }));
                    }}
                />
                <Plus
                    fontSize="small"
                    style={{ cursor: "pointer" }}
                    className="action_icon"
                    onClick={() => {
                        setCurrent((prev) => ({
                            ...prev,
                            applicability_id: params.data.applicability_id
                        }));
                        setIsModalOpen(true)
                    }}
                />
                <DeleteIcon
                    fontSize="small"
                    style={{ cursor: "pointer" }}
                    className="action_icon"
                    onClick={() => handleDelete(params.data.applicability_id)}
                />
            </div>
        )
    };

    // const statusCol = {
    //     headerName: 'Status',
    //     field: 'common_attributes.is_active',
    //     pinned: 'right',
    //     valueGetter: (params) =>
    //         params.data?.common_attributes?.is_active,
    //     cellRenderer: (params) => (
    //         <Toggle checked={!!params.value} />
    //     )
    // };

    const columnDefs = useMemo(() => {
        if (!data.length) return [];

        return [
            actionCol,
            ...generateDynamicColDefs(data),
            // statusCol
        ];
    }, [data]);

    const stateOnlyRowData = useMemo(() => {
        const uniqueStates = [
            ...new Set(
                data
                    .map(item => item.state)
                    .filter(Boolean)
            )
        ];

        return uniqueStates.map(s => ({ state: s }));
    }, [data]);

    // const columnDefs = useMemo(() => {
    //     if (!data.length) return [];

    //     return Object.keys(data[0]).map((key) => ({
    //         headerName: key.replace(/_/g, " ").toUpperCase(),
    //         field: key,
    //         sortable: true,
    //         filter: true,
    //         resizable: true,
    //         flex: 1,
    //     }));
    // }, [data]);


    const openModal = () => {
        setApplicabilityModal(true);
    };

    const closeModal = () => {
        setApplicabilityModal(false);
        setCurrent({});
    };
    const handleApplicability = async () => {
        const payload = {
            location_id: current?.location_id,
            register_id: current?.register_id,
        };

        try {
            let result;

            if (isEditing && current?.applicability_id) {
                result = await updateApplicabilityById(
                    current.applicability_id,
                    payload
                );
            } else {
                result = await createApplicability(payload);
            }

            const message =
                result?.message ||
                (isEditing
                    ? "Applicability updated successfully!"
                    : "Applicability created successfully!");

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
                message:
                    error?.response?.data?.message ||
                    (isEditing
                        ? "Failed to update applicability."
                        : "Failed to create applicability."),
                severityType: "error",
            });
        }

        setCurrent({
            location_id: null,
            register_id: null,
            location_name: "",
            register_name: "",
        });

        setApplicabilityModal(false);
    };

    const applicabilityForm = () => {
        return (
            <div>
                <div className="">
                    <span>
                        <div className="d-flex gap-3">
                            <SingleSelectTextField
                                name="location_name"
                                label="Location"
                                value={current.location_name}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const matchedLocation = locationName.find(
                                        (g) => g.name === selectedName
                                    );
                                    setCurrent((prev) => ({
                                        ...prev,
                                        location_name: selectedName,
                                        location_id: matchedLocation?._id || null,
                                    }));
                                }}
                                names={locationName}
                            />

                            <SingleSelectTextField name="register_name" label="Register" value={current?.register_name}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const matchedRegister = registerName.find(
                                        (g) => g.register_name === selectedName
                                    );
                                    setCurrent((prev) => ({
                                        ...prev,
                                        register_name: selectedName,
                                        register_id: matchedRegister?._id || null,
                                    }));
                                }}
                                names={registerName.map((item) => ({
                                    _id: item._id,
                                    name: item.register_name,
                                }))}
                            />

                        </div>
                    </span>
                </div>

                <div className="row row-gap-2">
                    <div className="col-12 col-md-6">
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={handleApplicability}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    };

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            'quickFilterText',
            document.getElementById('filter-text-box').value
        );
    }, []);
    const handlePipelineformSubmit = async () => {
        const payload = { applicability_id: current?.applicability_id, steps };
        try {
            const result = await createMapping(payload);
            setIsSnackbarsOpen({
                open: true,
                vertical: "top",
                horizontal: "center",
                message: result?.message || "Mapping created successfully!",
                severityType: "success",
            });
            setIsModalOpen(false);
        } catch (e) {
            setIsSnackbarsOpen({
                open: true,
                vertical: "top",
                horizontal: "center",
                message: e?.message || "Failed to create mapping.",
                severityType: "error",
            });
        }
    };
    return (
        <div className="app-container">
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            <div className="service-tracker-inner-page-header d-flex justify-content-between">
                <h1>Register Applicability</h1>
                <button className="crud_btn" onClick={openModal}>
                    Create Applicability
                </button>
            </div>
            <div className="mapping-container d-flex gap-3">
                <SingleSelectTextField
                    name="group_name"
                    label="Group Holding"
                    value={current.group_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedGroup = groupHoldingName.find(
                            (g) => g.name === selectedName
                        );
                        setCurrent((prev) => ({
                            ...prev,
                            group_name: selectedName,
                            group_holding_id: matchedGroup?._id || null,
                            company_name: '',
                            location_name: '',
                        }));
                        dataById.applicabilityByGroupId.length > 0 ? setSource("group") : "";
                    }}
                    names={groupHoldingName}
                />

                <SingleSelectTextField name="company_name" label="Company Name" value={current?.company_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedCompany = companyName.find(
                            (g) => g.company_name === selectedName
                        );

                        setCurrent((prev) => ({
                            ...prev,
                            company_name: selectedName,
                            company_id: matchedCompany?._id || null,
                            location_name: '',
                            location_id: null,
                        }));

                        // 🔥 Fallback
                        if (matchedCompany?._id) {
                            setSource("company");
                        } else if (current?.group_holding_id) {
                            setSource("group");
                        }
                    }}
                    names={companyName.map((item) => ({
                        _id: item._id,
                        name: item.company_name,
                    }))}
                />
                <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedLocation = locationNameByCompanyId.find(
                            (g) => g.location_name === selectedName
                        );

                        setCurrent((prev) => ({
                            ...prev,
                            location_name: selectedName,
                            location_id: matchedLocation?._id || null,
                        }));

                        // 🔥 Source fallback logic
                        if (matchedLocation?._id) {
                            setSource("location");
                        } else if (current?.company_id) {
                            setSource("company");
                        } else if (current?.group_holding_id) {
                            setSource("group");
                        }
                    }}
                    names={locationNameByCompanyId.map((item) => ({
                        _id: item._id,
                        name: item.location_name,
                    }))}
                />
            </div>
            <div className='table_div p-3'>
                <div className='d-flex align-items-center gap-2'>
                    <AnimatedSearchBar
                        placeholder="Search..."
                        type="text"
                        id="filter-text-box"
                        onInput={onFilterTextBoxChanged}
                    />

                    <MultiSelectFilter
                        rowData={stateOnlyRowData}
                        onFilterApply={handleFilterApply}
                    />
                </div>

                <div
                    className="ag-theme-quartz"
                    style={{ height: '600px', width: '100%', marginTop: '1rem' }}
                >
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={filteredData.length ? filteredData : data}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        editType="fullRow"
                        rowSelection="single"
                        pagination={true}
                    />
                </div>
            </div>
            <RegisterMappingPage
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setSteps={setSteps}
                steps={steps}
                handlePipelineformSubmit={handlePipelineformSubmit}
            />
            <SmallSizeModal
                crudForm={applicabilityForm}
                crudTitle={"Create Applicability"}
                isEditing={isEditing}
                editCrudTitle={"Edit Applicability"}
                isModalOpen={applicabilityModal}
                setIsModalOpen={setApplicabilityModal}
                closeModal={closeModal}
            />
        </div>
    )
}

export default RegisterProcessingViewPage