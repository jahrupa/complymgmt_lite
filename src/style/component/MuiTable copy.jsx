import * as React from 'react';
import { DataGrid, GridCellModes , 
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,} from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../style/useRole.css'
// ✅ This is your data (was incorrectly named "columns")


const rows = [
    {
        modules_id: 1,
        module_name: "Outsourcing Management",
        module_description:
            "Outsourcing Tracker, Salary deployment + PF/ESI mapping in Reimbursement, Reimbursement Tracker, Outsourcing Billing Tracker",
        group_holding_name: "Bajaj Group",
        company_name: "Bajaj Finserv",
        location_name: "PUNE, Maharashtra 400051",
        headerClassName: 'custom-header-class',
    },
    {
        modules_id: 2,
        module_name: "AI",
        module_description: "Optional advisory tracker",
        group_holding_name: "Reliance IndustriesS",
        company_name: "Jio Platforms",
        location_name: "Surat, Gujarat",
    },
    {
        modules_id: 3,
        module_name: "Intelligence & AI Engine",
        module_description:
            "NPS columns in Helpdesk Tracker, Due dates from trackers, Optional advisory tracker",
        group_holding_name: "Mahindra Group",
        company_name: "Mahindra Tech Services",
        location_name: "Hyderabad, Telangana",
    },
    {
        modules_id: 4,
        module_name: "Finance & Billing",
        module_description:
            "Compliance Billing Tracker, Outsourcing Billing Tracker, Associate Billing, Reimbursement Tracker",
        group_holding_name: "Wipro",
        company_name: "Wipro Digital",
        location_name: "Bengaluru, Karnataka",
    },
    {
        modules_id: 5,
        module_name: "Document & Workflow Engine",
        module_description:
            "Document Upload Tracker, SLA columns in trackers, Config sheet (possibly future tracker), Config columns (optional tracker)",
        group_holding_name: "Reliance IndustriesS",
        company_name: "Jio Platforms",
        location_name: "Mumbai, Maharashtra 400051",
    },
];

// ✅ Columns define how the data should be shown
const columns = [{
    field: 'action',
    headerName: 'Action',
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    cellClassName: 'sticky-action-column',
    // columnClassName: 'sticky-action-column', // Add custom class
    renderCell: (params) => (
        <div className='d-flex justify-content-between w-100'>
            <div>
                <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.groups_holdings_id)}><EditIcon className='action_icon' /></button>
            </div>
            {/* <IconButton
          color="error"
          size="small"
          onClick={() => handleDelete(params.row.modules_id)}
        >
          <DeleteIcon />
        </IconButton> */}
            <div>
                <button className='btn  mt-1 btn-sm' onClick={() => {
                    setgroupId(item.groups_holdings_id);
                    setIsDeleteModalOpen(true);
                }}><DeleteIcon className='action_icon' /></button>
            </div>
        </div>
    ),
},
{ field: 'module_name', headerName: 'Module Name', flex: 1, minWidth: 200, editable: true, },
{ field: 'module_description', headerName: 'Description', flex: 2, minWidth: 300, editable: true, },
{ field: 'group_holding_name', headerName: 'Group Holding', flex: 1, minWidth: 150, editable: true, },
{ field: 'company_name', headerName: 'Company', flex: 1, minWidth: 150, editable: true, },
{ field: 'location_name', headerName: 'Location', flex: 1, minWidth: 180, editable: true, },
];

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
          Custom Toolbar
        </Typography>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector
          slotProps={{ tooltip: { title: 'Change density' } }}
        />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: 'Export data' },
            button: { material: { variant: 'outlined' } },
          }}
        />
      </GridToolbarContainer>
    );
  }
export default function ModuleTable() {
    const [cellModesModel, setCellModesModel] = React.useState({});

    const handleCellClick = React.useCallback((params, event) => {
        if (!params.isEditable) return;

        if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
            return;
        }

        setCellModesModel((prevModel) => {
            const updatedModel = Object.keys(prevModel).reduce((acc, id) => {
                acc[id] = Object.keys(prevModel[id]).reduce((fields, field) => {
                    fields[field] = { mode: GridCellModes.View };
                    return fields;
                }, {});
                return acc;
            }, {});

            return {
                ...updatedModel,
                [params.id]: {
                    ...updatedModel[params.id],
                    [params.field]: { mode: GridCellModes.Edit },
                },
            };
        });
    }, []);

    const handleCellModesModelChange = React.useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);
    return (
        <Box 
      
        sx={{
            height: 450, width: '100%' ,
            '& .sticky-action-column': {
              backgroundColor: '#d5e1e7',
              borderTop:'1px solid #00000012 !important',
              position: 'sticky',
              left: 0,
              zIndex: 2,
              background:'#f2f2f2' ,
            },
            
          }}
          >
            <Typography variant="h6" gutterBottom>Modules Table</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.modules_id} // ✅ Unique ID required
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                
                disableRowSelectionOnClick
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                slots={{
                    toolbar: CustomToolbar,
                  }}
                  showToolbar
            />
        </Box>
    );
}
