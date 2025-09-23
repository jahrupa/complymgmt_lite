import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const rawRows = [
  { id: 1, name: 'Company A', type: 'parent' },
  { id: 2, name: 'John (HR)', parentId: 1, type: 'child' },
  { id: 3, name: 'Jane (Engineering)', parentId: 1, type: 'child' },
  { id: 4, name: 'Company B', type: 'parent' },
  { id: 5, name: 'Alice (Finance)', parentId: 4, type: 'child' },
];

export default function ManualTreeDataGrid1() {
  const [expanded, setExpanded] = React.useState([]);

  const toggleExpand = (parentId) => {
    setExpanded((prev) =>
      prev.includes(parentId) ? prev.filter((id) => id !== parentId) : [...prev, parentId]
    );
  };

  const visibleRows = rawRows.filter(
    (row) => row.type === 'parent' || expanded.includes(row.parentId)
  );

  const columns = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        if (row.type === 'parent') {
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
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        return (
          <div style={{ paddingLeft: row.type === 'child' ? 30 : 0 }}>
            {params.value}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={visibleRows}
        columns={columns}
        disableSelectionOnClick
        hideFooter
        getRowHeight={() => 40}
      />
    </div>
  );
}
