import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    Toolbar,
    ToolbarButton,
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    ExportCsv,
    ExportPrint,
    QuickFilter,
    QuickFilterControl,
    QuickFilterClear,
    QuickFilterTrigger,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

// ✅ Sample data with required `id` field
const rows = [
    {
        id: 1,
        modules_id: 1,
        module_name: "Outsourcing Management",
        module_description:
            "Outsourcing Tracker, Salary deployment + PF/ESI mapping in Reimbursement, Reimbursement Tracker, Outsourcing Billing Tracker",
        group_holding_name: "Bajaj Group",
        company_name: "Bajaj Finserv",
        location_name: "PUNE, Maharashtra 400051",
        headerClassName: 'sticky-action-column',
    },
    {
        id: 2,
        modules_id: 2,
        module_name: "AI",
        module_description: "Optional advisory tracker",
        group_holding_name: "Reliance IndustriesS",
        company_name: "Jio Platforms",
        location_name: "Surat, Gujarat",
    },
    {
        id: 3,
        modules_id: 3,
        module_name: "Intelligence & AI Engine",
        module_description:
            "NPS columns in Helpdesk Tracker, Due dates from trackers, Optional advisory tracker",
        group_holding_name: "Mahindra Group",
        company_name: "Mahindra Tech Services",
        location_name: "Hyderabad, Telangana",
    },
    {
        id: 4,
        modules_id: 4,
        module_name: "Finance & Billing",
        module_description:
            "Compliance Billing Tracker, Outsourcing Billing Tracker, Associate Billing, Reimbursement Tracker",
        group_holding_name: "Wipro",
        company_name: "Wipro Digital",
        location_name: "Bengaluru, Karnataka",
    },
    {
        id: 5,
        modules_id: 5,
        module_name: "Document & Workflow Engine",
        module_description:
            "Document Upload Tracker, SLA columns in trackers, Config sheet (possibly future tracker), Config columns (optional tracker)",
        group_holding_name: "Reliance IndustriesS",
        company_name: "Jio Platforms",
        location_name: "Mumbai, Maharashtra 400051",
    },
];

// ✅ Placeholder handlers (should be implemented properly)
const handleEdit = (id) => {
    console.log('Edit clicked for ID:', id);
};

const setgroupId = (id) => {
    console.log('Set group ID to delete:', id);
};

const setIsDeleteModalOpen = (value) => {
    console.log('Set delete modal open:', value);
};

const columns = [
    {
        field: 'action',
        headerName: 'Action',
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        cellClassName: 'sticky-action-column',
        headerClassName: 'sticky-action-column',
        renderCell: (params) => (
            <div className='d-flex justify-content-between w-100'>
                <button className='btn mt-1 btn-sm' onClick={() => handleEdit(params.row.modules_id)}>
                    <EditIcon className='action_icon' />
                </button>
                <button className='btn mt-1 btn-sm' onClick={() => {
                    setgroupId(params.row.modules_id);
                    setIsDeleteModalOpen(true);
                }}>
                    <DeleteIcon className='action_icon' />
                </button>
            </div>
        ),
    },
    { field: 'module_name', headerName: 'Module Name', flex: 1, minWidth: 200, editable: true },
    { field: 'module_description', headerName: 'Description', flex: 2, minWidth: 300, editable: true },
    { field: 'group_holding_name', headerName: 'Group Holding', flex: 1, minWidth: 150, editable: true },
    { field: 'company_name', headerName: 'Company', flex: 1, minWidth: 150, editable: true },
    { field: 'location_name', headerName: 'Location', flex: 1, minWidth: 180, editable: true },
];

const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}));

function CustomToolbar() {
    const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
    const exportMenuTriggerRef = React.useRef(null);

    return (
        <Toolbar>
            <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
                Custome Toolbar
            </Typography>

            <Tooltip title="Columns">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumnIcon fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title="Filters">
                <FilterPanelTrigger
                    render={(props, state) => (
                        <ToolbarButton {...props} color="default">
                            <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                <FilterListIcon fontSize="small" />
                            </Badge>
                        </ToolbarButton>
                    )}
                />
            </Tooltip>
            {/* print */}
            {/* <ExportPrint /> */}
            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title="Export">
                <ToolbarButton
                    ref={exportMenuTriggerRef}
                    id="export-menu-trigger"
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    aria-expanded={exportMenuOpen ? 'true' : undefined}
                    onClick={() => setExportMenuOpen(true)}
                >
                    <FileDownloadIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>

            <Menu
                id="export-menu"
                anchorEl={exportMenuTriggerRef.current}
                open={exportMenuOpen}
                onClose={() => setExportMenuOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                    Print
                </ExportPrint>
                <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                    Download as CSV
                </ExportCsv>
            </Menu>

            <StyledQuickFilter>
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Search" enterDelay={0}>
                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{ expanded: state.expanded }}
                                color="default"
                            >
                                <SearchIcon fontSize="small" />
                            </StyledToolbarButton>
                        </Tooltip>
                    )}
                />
                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (
                        <StyledTextField
                            {...controlProps}
                            ownerState={{ expanded: state.expanded }}
                            inputRef={ref}
                            aria-label="Search"
                            placeholder="Search..."
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: state.value ? (
                                    <InputAdornment position="end">
                                        <QuickFilterClear edge="end" size="small" aria-label="Clear search">
                                            <CancelIcon fontSize="small" />
                                        </QuickFilterClear>
                                    </InputAdornment>
                                ) : null,
                            }}
                        />
                    )}
                />
            </StyledQuickFilter>
        </Toolbar>
    );
}

  
export default function ModuleTable() {
     // 👇 Your pinned column logic
  function applyPinnedColumns(columns, pinnedLeft = []) {
    return columns.map((col) => {
      if (pinnedLeft.includes(col.field)) {
        return {
          ...col,
          cellClassName: 'sticky-action-column',
          headerClassName: 'sticky-action-column',
        };
      }
      return col;
    });
  }

  const pinnedLeft = ['action']; // 👈 You can include more like 'module_name' etc.
  const finalColumns = applyPinnedColumns(columns, pinnedLeft);
    
    return (
        <Box
            sx={{
                height: 450,
                width: '100%',
                '& .MuiDataGrid-cell.sticky-action-column': {
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    backgroundColor: '#f2f2f2',
                },
                '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader.sticky-action-column': {
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                    backgroundColor: '#f2f2f2',
                },
            }}

        >
            <div>
                <DataGrid
                    rows={rows}
                    columns={finalColumns}
                    slots={{ toolbar: CustomToolbar }}
                    showToolbar
                />
            </div>
        </Box>

    );
}
