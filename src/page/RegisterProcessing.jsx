import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllFiles, fetchAllGroupHolding, fetchCompaniesNameByGroupId, getApplicabilityByCompanyId, getApplicabilityByGroupId, getApplicabilityByLocationId, getLocationByCompanyId, uploadFileGolang } from '../api/service'
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField'
import { AgGridReact } from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import MultiFileUpload from '../component/MultiFileUpload';
import SmallSizeModal from '../component/SmallSizeModal';
ModuleRegistry.registerModules([AllCommunityModule]);

const RegisterProcessing = () => {
    const [groupHoldingName, setGroupHoldingName] = useState([])
    const [companyName, setCompanyName] = useState([])
    const [locationName, setLocationName] = useState([])
    const [current, setCurrent] = useState(
        {
            group_name: "",
            group_holding_id: null,
            company_name: "",
            company_id: null,
            location_name: "",
            location_id: null,
        });
    const [isFileUploadModalOpen, setIsFileUploadModalModalOpen] = useState(false);
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
    console.log(dataById.applicabilityByLocationId.length, 'applicabilityByLocationId')
    const [source, setSource] = useState(null);
    console.log(source, 'source')
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
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompaniesNameByGroupId(current?.group_holding_id);
                const applicabilityByGroupId = await getApplicabilityByGroupId(current?.group_holding_id);
                if (data) {
                    setCompanyName(data);
                    setDataById(prev => ({
                        ...prev,
                        applicabilityByGroupId: applicabilityByGroupId || []
                    }));
                    setSource("group");
                }
            } catch {
                setDataById(prev => ({
                    ...prev,
                    applicabilityByGroupId: []
                }));
                // console.error("Failed to fetch company:", error);
            }
        };

        if (current?.group_holding_id) {
            fetchCompany();
        }
    }, [current?.group_holding_id]);

    useEffect(() => {
        const fetchLocationByCompanyId = async () => {
            try {
                const data = await getLocationByCompanyId(current?.company_id);
                const applicabilityByCompanyId = await getApplicabilityByCompanyId(current?.company_id);
                if (data) {
                    setLocationName(data);
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

    const columnDefs = useMemo(() => {
        if (!data.length) return [];

        return Object.keys(data[0]).map((key) => ({
            headerName: key.replace(/_/g, " ").toUpperCase(),
            field: key,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        }));
    }, [data]);

    useEffect(() => {
        console.log("SOURCE:", source);
        console.log("FINAL DATA:", data);
        console.log("FULL STATE:", dataById);
    }, [dataById, source]);
    const openModal = () => {
        setIsFileUploadModalModalOpen(true);
    };

    const closeModal = () => {
        setIsFileUploadModalModalOpen(false);
        setUploadedFiles([]);

    };
    const handleFileUpload = async () => {
        if (!uploadedFiles?.length) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "Please select at least one file.",
                severityType: "warning",
            });
            return;
        }
        try {
            const result = await uploadFileGolang(uploadedFiles);
            setIsFileUploadModalModalOpen(false);
            const message = result?.message || "Status update successfully";
            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: "success",
            });
            const updatedData = await fetchAllFiles();
            // setData(updatedData);
            setUploadedFiles([]);
        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message,
                severityType: "error",
            });
        }
    };

    const fileUploadForm = () => {
        return (
            <div>
                <div className="d-flex align-items-center">
                    <span>
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
                                    }));
                                }}
                                names={companyName.map((item) => ({
                                    _id: item._id,
                                    name: item.company_name,
                                }))}
                            />
                            <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const matchedLocation = locationName.find(
                                        (g) => g.location_name === selectedName
                                    );
                                    setCurrent((prev) => ({
                                        ...prev,
                                        location_name: selectedName,
                                        location_id: matchedLocation?._id || null,
                                    }));
                                }}
                                names={locationName.map((item) => ({
                                    _id: item._id,
                                    name: item.location_name,
                                }))}
                            />
                        </div>
                    </span>
                </div>

                <div className="mb-3 ps-3 pe-3 pb-3 mt-4">
                    <div className="button-wrap">
                        <MultiFileUpload
                            setUploadedFiles={setUploadedFiles}
                            uploadedFiles={uploadedFiles}
                        />
                    </div>
                </div>

                <div className="row row-gap-2">
                    <div className="col-12 col-md-6">
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={''}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={handleFileUpload}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="app-container">
            <div className="service-tracker-inner-page-header d-flex justify-content-between">
                <h1>Register Processing</h1>
                <button className="crud_btn" onClick={openModal}>
                    Pipeline
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
                        }));
                        dataById.applicabilityByCompanyId.length > 0 ? setSource("company") : "";
                    }}
                    names={companyName.map((item) => ({
                        _id: item._id,
                        name: item.company_name,
                    }))}
                />
                <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedLocation = locationName.find(
                            (g) => g.location_name === selectedName
                        );
                        setCurrent((prev) => ({
                            ...prev,
                            location_name: selectedName,
                            location_id: matchedLocation?._id || null,
                        }));
                        dataById.applicabilityByLocationId.length > 0 ? setSource("location") : "";
                    }}
                    names={locationName.map((item) => ({
                        _id: item._id,
                        name: item.location_name,
                    }))}
                />
            </div>
            <div
                className="ag-theme-quartz"
                style={{ height: "600px", width: "100%", marginTop: "1rem" }}
            >
                <AgGridReact
                    theme="legacy"
                    // ref={gridRef}
                    rowData={data || []}
                    columnDefs={columnDefs}
                    defaultColDef={''}
                    editType="fullRow"
                    rowSelection="single"
                    pagination={true}
                // rowBuffer={rowBuffer}
                />
            </div>
            <SmallSizeModal
                crudForm={fileUploadForm}
                crudTitle={"File Upload"}
                isEditing={false}
                editCrudTitle={""}
                isModalOpen={isFileUploadModalOpen}
                setIsModalOpen={setIsFileUploadModalModalOpen}
                closeModal={closeModal}
            />
        </div>
    )
}

export default RegisterProcessing