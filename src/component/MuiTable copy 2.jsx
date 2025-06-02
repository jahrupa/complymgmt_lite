import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const rawRows = [
  { id: 1, name: 'Grandfather 1' },
  { id: 2, name: 'Father 1.1', parentId: 1 },
  { id: 3, name: 'Child 1.1.1', parentId: 2 },
  { id: 4, name: 'Father 1.2', parentId: 1 },
  { id: 5, name: 'Child 1.2.1', parentId: 4 },
  { id: 6, name: 'Grandfather 2' },
  { id: 7, name: 'Father 2.1', parentId: 6 },
];

export default function MultiLevelTreeGrid2() {
  const [expanded, setExpanded] = React.useState([]);

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Recursively build visible rows based on expansion state
  const getVisibleRows = () => {
    const map = {};
    rawRows.forEach((row) => {
      map[row.id] = row;
    });

    const build = (parentId = null, level = 0) => {
      return rawRows
        .filter((row) => (parentId ? row.parentId === parentId : !row.parentId))
        .flatMap((row) => {
          const isExpanded = expanded.includes(row.id);
          const children = isExpanded ? build(row.id, level + 1) : [];
          return [{ ...row, level }, ...children];
        });
    };

    return build();
  };

  const visibleRows = getVisibleRows();

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
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        return (
          <div style={{ paddingLeft: row.level * 20 }}>
            {params.value}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={visibleRows}
        columns={columns}
        getRowId={(row) => row.id}
        hideFooter
        disableSelectionOnClick
        getRowHeight={() => 40}
      />
    </div>
  );
}
