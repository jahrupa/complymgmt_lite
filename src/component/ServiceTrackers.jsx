import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import SearchIcon from '@mui/icons-material/Search';
import AgGridSearchBar from './MuiInputs/AgGridSearchBar';
import Modal from './Modal'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import exportCsvIcon from '../assets/Arrow-Line.png'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import SingleSelectTextField from './MuiInputs/SingleSelectTextField';
import { fetchAllGroupHolding, fetchAllLocation, getCompanyByGroupId } from '../api/Service';
import MuiTextField from '../component/MuiInputs/MuiTextField';

// Register module
ModuleRegistry.registerModules([AllCommunityModule]);
const groupHoldings = [
    { name: 'Tata' },
    { name: 'Birla' },
    { name: 'Ambani' },
];

const companies = [
    { name: 'Tata Tea', group: 'Tata' },
    { name: 'Tata Consultancy Services', group: 'Tata' },
    { name: 'Birla Cement', group: 'Birla' },
    { name: 'Reliance', group: 'Ambani' },
];

const locations = [
    { name: 'Mumbai', company: 'Tata Tea' },
    { name: 'Bangalore', company: 'Tata Consultancy Services' },
    { name: 'Kolkata', company: 'Birla Cement' },
    { name: 'Mumbai', company: 'Reliance' },
];

const modulesList = [
    { name: 'Compliance Management', location: 'Mumbai' },
    { name: 'Outsourcing Management', location: 'Bangalore' },
    { name: 'Finance & Billing', location: 'Kolkata' },
];

const subModules = [
    { name: 'Audit Trail', module: 'Compliance Management' },
    { name: 'Vendor Onboarding', module: 'Outsourcing Management' },
    { name: 'Invoice Processing', module: 'Finance & Billing' },
];

let idCounter = 1;

function ServiceTrackers() {
    const [newGroup, setNewGroup] = useState('');
    const [newCompany, setNewCompany] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newModule, setNewModule] = useState('');
    const [newSubModule, setNewSubModule] = useState('');
    const [newServiceTracker, setNewServiceTracker] = useState('');
    const [serviceTrackers, setServiceTrackers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [groupHoldingData, setGroupHoldinData] = useState([])
    const [companyNameData, setCompanyNameData] = useState([])
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([])
    const [isEditing, setIsEditing] = useState(false);

    const [currentData, setCurrentData] = useState(
        {
            id: null, company_name: '',
            company_id: null,
            group_holding_name: '',
            created_at: '',
            location_name: "",
            // location_id: null,
            updated_at: '',
            service_tracker_name: '',
            sub_module_name:'',
            module_name:'',
        });
    const gridRef = useRef();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const filteredCompanies = useMemo(() =>
        companies.filter(c => c.group === newGroup), [newGroup]);

    const filteredLocations = useMemo(() =>
        locations.filter(l => l.company === newCompany), [newCompany]);

    const filteredModules = useMemo(() =>
        modulesList.filter(m => m.location === newLocation), [newLocation]);

    const filteredSubModules = useMemo(() =>
        subModules.filter(s => s.module === newModule), [newModule]);

    useEffect(() => {
        setNewCompany('');
        setNewLocation('');
        setNewModule('');
        setNewSubModule('');
    }, [newGroup]);

    useEffect(() => {
        setNewLocation('');
        setNewModule('');
        setNewSubModule('');
    }, [newCompany]);

    useEffect(() => {
        setNewModule('');
        setNewSubModule('');
    }, [newLocation]);

    useEffect(() => {
        setNewSubModule('');
    }, [newModule]);

    const addServiceTracker = () => {
        if (newGroup && newCompany && newLocation && newModule && newSubModule && newServiceTracker) {
            const newEntry = {
                id: idCounter++,
                group: newGroup,
                company: newCompany,
                location: newLocation,
                module: newModule,
                subModule: newSubModule,
                serviceTracker: newServiceTracker
            };
            setServiceTrackers([...serviceTrackers, newEntry]);
            alert(`Service Tracker "${newServiceTracker}" added under "${newSubModule}"`);

            setNewGroup('');
            setNewCompany('');
            setNewLocation('');
            setNewModule('');
            setNewSubModule('');
            setNewServiceTracker('');
        }
    };

    const deleteRow = (id) => {
        const row = serviceTrackers.find(item => item.id === id);
        if (row) {
            alert(`Deleted Service Tracker:\n${JSON.stringify(row, null, 2)}`);
        }
        setServiceTrackers(serviceTrackers.filter(item => item.id !== id));
    };

    const onRowValueChanged = (event) => {
        alert(`Service Tracker updated:\n${JSON.stringify(event.data, null, 2)}`);
    };
    const rowBuffer = 0;
    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            "quickFilterText",
            document.getElementById("filter-text-box").value,
        );
    }, []);
    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    };
    const colDefs = [
        { field: 'id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'group', headerName: 'Group', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'company', headerName: 'Company', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'module', headerName: 'Module', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'subModule', headerName: 'Sub-Module', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'serviceTracker', headerName: 'Service Tracker Name', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            headerName: 'Actions',
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            cellRenderer: (params) => {
                <button onClick={() => deleteRow(params.data.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
                // const btn = document.createElement('button');
                // btn.innerText = 'Delete';
                // btn.onclick = () => deleteRow(params.data.id);
                // return btn;
            }
        }
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationData, groupHolding, companyName] = await Promise.all([
                    fetchAllLocation(),
                    fetchAllGroupHolding(),
                    // fetchAllCompaniesName(),
                ]);
                setData(locationData);
                setGroupHoldinData(groupHolding);
                setCompanyNameData(companyName);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchServiceTracker = async () => {
            try {
                const data = await getCompanyByGroupId(currentData?.groups_holdings_id);
                const company = data?.companies?.[0];

                if (company) {
                    // Set company name list for dropdown (even though it's disabled)
                    setCompanyNameByGroupHoldingId([{ id: company.id, name: company.name }]);

                    // Set selected company name in state
                    setCurrent((prev) => ({
                        ...prev,
                        company_name: company.name,
                        company_id: company.id,

                    }));
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (currentData?.groups_holdings_id) {
            fetchServiceTracker();
        }
    }, [currentData?.groups_holdings_id]);

    const crudForm = () => {
        return (
            <div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <MuiTextField label='Service Tracker Name' type='text' isRequired={true} fieldName='service_tracker_name' handleChange={handleChange} value={currentData.service_tracker_name} />

                    <SingleSelectTextField
                        name="group_holding_name"
                        label="Group Holding"
                        value={currentData?.group_holding_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingData.find(
                                (g) => g.name === selectedName
                            );
                            setCurrentData((prev) => ({
                                ...prev,
                                group_holding_name: selectedName,
                                groups_holdings_id: matchedGroup?.id || null,
                                company_name: '',
                            }));
                        }}
                        names={groupHoldingData}
                    // isdisable={isEditing}
                    />

                </div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <SingleSelectTextField
                        name="company_name"
                        label="Company"
                        // value={currentData?.company_name}
                        onChange={(e) => {
                            // const selectedName = e.target.value;
                            // const matchedGroup = groupHoldingData.find(
                            //     (g) => g.name === selectedName
                            // );
                            // setCurrentData((prev) => ({
                            //     ...prev,
                            //     company_name: selectedName,
                            //     groups_holdings_id: matchedGroup?.id || null,
                            //     company_name: '', 
                            // }));
                        }}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />
                    <SingleSelectTextField
                        name="location_name"
                        label="Location"
                        // value={currentData?.location_name}
                        onChange={(e) => setCurrentData((prev) => ({ ...prev, location_name: e.target.value }))}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />
                </div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <SingleSelectTextField
                        name="module_name"
                        label="Module"
                        // value={currentData?.module_name}
                        onChange={(e) => {
                            // const selectedName = e.target.value;
                            // const matchedGroup = groupHoldingData.find(
                            //     (g) => g.name === selectedName
                            // );
                            // setCurrentData((prev) => ({
                            //     ...prev,
                            //     module_name: selectedName,
                            //     groups_holdings_id: matchedGroup?.id || null,
                            //     module_name: '', 
                            // }));
                        }}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />
                    <SingleSelectTextField
                        name="sub_module_name"
                        label="Sub-Module"
                        // value={currentData?.sub_module_name}
                        onChange={(e) => setCurrentData((prev) => ({ ...prev, sub_module_name: e.target.value }))}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />
                </div>
                {/* <select value={newGroup} onChange={e => setNewGroup(e.target.value)}>
                    <option value="" disabled>Select Group</option>
                    {groupHoldings.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                </select> */}

                {/* <select value={newCompany} onChange={e => setNewCompany(e.target.value)} disabled={!newGroup}>
                    <option value="" disabled>Select Company</option>
                    {filteredCompanies.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>

                <select value={newLocation} onChange={e => setNewLocation(e.target.value)} disabled={!newCompany}>
                    <option value="" disabled>Select Location</option>
                    {filteredLocations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                </select>

                <select value={newModule} onChange={e => setNewModule(e.target.value)} disabled={!newLocation}>
                    <option value="" disabled>Select Module</option>
                    {filteredModules.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>

                <select value={newSubModule} onChange={e => setNewSubModule(e.target.value)} disabled={!newModule}>
                    <option value="" disabled>Select Sub-Module</option>
                    {filteredSubModules.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>

                <input
                    value={newServiceTracker}
                    onChange={e => setNewServiceTracker(e.target.value)}
                    placeholder="Enter Service Tracker Name"
                    disabled={!newSubModule}
                />

                <button onClick={addServiceTracker} disabled={!newServiceTracker}>Add Service Tracker</button> */}
                <div className="row row-gap-2">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={addServiceTracker}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Service Tracker</span>}</button>
                    </div>
                </div>
            </div>

        )

    }
    const crudTitle = "Add New Service Tracker"
    return (
        <div style={{ padding: '1rem' }}>
            <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

            <h5>Service Tracker Manager</h5>

            <div className='table_div  p-3'>
                <div className='d-lg-flex d-md-flex justify-content-between'>
                    <div className="search-bar-container h-25">
                        <AgGridSearchBar label='Search...' type='text' id="filter-text-box" onInput={onFilterTextBoxChanged} />
                        <button className='search-icon'><SearchIcon /></button>
                    </div>
                    <div className='d-lg-flex d-md-flex justify-content-between'>

                        <div className='d-lg-flex d-md-flex gap-2'>
                            <div>
                                <button onClick={onBtnExport} className='crud_btn'><img src={exportCsvIcon} alt='csv export icon' width='12' className='mb-1 me-1' />Export</button>
                            </div>
                            <div>
                                <div className=' d-flex justify-content-end'>
                                    <button className='crud_btn' onClick={openModal}>Add Service Tracker</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={serviceTrackers}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        editType="fullRow"
                        rowSelection="single"
                        pagination={true}
                        rowBuffer={rowBuffer}
                        onRowValueChanged={onRowValueChanged}
                    />
                </div>
            </div>



        </div>
    );
}

export default ServiceTrackers;