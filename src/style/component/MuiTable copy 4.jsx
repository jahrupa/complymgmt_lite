import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Badge,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// ✅ Sample tree rows with parent-child structure
const rawRows = [
  {
    id: 1,
    type: 'grandfather',
    name: 'Bajaj Group',
    module_name: 'Outsourcing Management',
    module_description: 'Trackers & billing tools',
    company_name: 'Bajaj Finserv',
    location_name: 'PUNE, Maharashtra',
  },
  {
    id: 2,
    parentId: 1,
    type: 'father',
    name: 'AI Division',
    module_name: 'AI Tools',
    module_description: 'Advisory & ML modules',
    company_name: 'Jio Platforms',
    location_name: 'Surat, Gujarat',
  },
  {
    id: 3,
    parentId: 2,
    type: 'child',
    name: 'Smart Engine',
    module_name: 'Intelligence Engine',
    module_description: 'NPS columns, due dates',
    company_name: 'Mahindra Tech',
    location_name: 'Hyderabad, Telangana',
  },
  {
    id: 4,
    type: 'grandfather',
    name: 'Wipro Group',
    module_name: 'Finance & Billing',
    module_description: 'Billing, Reimbursements',
    company_name: 'Wipro Digital',
    location_name: 'Bengaluru, Karnataka',
  },
  {
    id: 5,
    parentId: 4,
    type: 'child',
    name: 'Workflow Engine',
    module_name: 'Document Engine',
    module_description: 'Document Tracker, SLAs',
    company_name: 'Jio Platforms',
    location_name: 'Mumbai, Maharashtra',
  },
];

// ✅ Helpers
const handleEdit = (id) => console.log('Edit', id);
const setgroupId = (id) => console.log('Set Group ID', id);
const setIsDeleteModalOpen = (val) => console.log('Delete Modal:', val);

// ✅ Expand/collapse logic
function useTreeRows(data) {
  const [expanded, setExpanded] = React.useState([]);

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const visibleRows = data.filter((row) => {
    if (!row.parentId) return true;
    return expanded.includes(row.parentId);
  });

  return { expanded, toggleExpand, visibleRows };
}

// ✅ Custom Toolbar
function CustomToolbar() {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef(null);

  return (
    <Toolbar>
      <Typography fontWeight="medium" sx={{ flex: 1 }}>
        Custom Toolbar
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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Export">
        <ToolbarButton
          ref={exportMenuTriggerRef}
          onClick={() => setExportMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Menu
        anchorEl={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
      >
        <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
          Print
        </ExportPrint>
        <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
          Download CSV
        </ExportCsv>
      </Menu>

      <QuickFilterTrigger
        render={(triggerProps, state) => (
          <Tooltip title="Search">
            <ToolbarButton {...triggerProps} color="default">
              <SearchIcon fontSize="small" />
            </ToolbarButton>
          </Tooltip>
        )}
      />
      <QuickFilterControl
        render={({ ref, ...controlProps }, state) => (
          <TextField
            {...controlProps}
            inputRef={ref}
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
                  <QuickFilterClear>
                    <CancelIcon fontSize="small" />
                  </QuickFilterClear>
                </InputAdornment>
              ) : null,
            }}
          />
        )}
      />
    </Toolbar>
  );
}

// ✅ Final Component
export default function HierarchicalModuleTable() {
  const { visibleRows, expanded, toggleExpand } = useTreeRows(rawRows);

  const columns = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        const hasChildren = rawRows.some((r) => r.parentId === row.id);
        if (hasChildren) {
          const isOpen = expanded.includes(row.id);
          return (
            <IconButton size="small" onClick={() => toggleExpand(row.id)}>
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          );
        }
        return null;
      },
    },
    {
      field: 'module_name',
      headerName: 'Module Name',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const row = params.row;
        const indent = row.type === 'child' ? 40 : row.type === 'father' ? 20 : 0;
        return (
          <div style={{ paddingLeft: indent }}>
            {params.value}
          </div>
        );
      },
    },
    { field: 'module_description', headerName: 'Description', flex: 2, minWidth: 250 },
    { field: 'company_name', headerName: 'Company', flex: 1, minWidth: 150 },
    { field: 'location_name', headerName: 'Location', flex: 1, minWidth: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div className="d-flex">
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => {
            setgroupId(params.row.id);
            setIsDeleteModalOpen(true);
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
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
      <DataGrid
        rows={visibleRows}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        hideFooter
      />
    </Box>
  );
}
