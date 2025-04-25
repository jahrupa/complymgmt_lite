import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Stack, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function GroupOnboardingPage() {
  const [rows, setRows] = React.useState([
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: '', age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [editRowId, setEditRowId] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditFormData({ ...row });
  };

  const handleDeleteClick = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSaveClick = () => {
    setRows(rows.map((row) => (row.id === editRowId ? editFormData : row)));
    setEditRowId(null);
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const handleBulkDelete = () => {
    setRows(rows.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            name="firstName"
            value={editFormData.firstName || ''}
            onChange={handleEditChange}
            size="small"
          />
        ) : (
          params.row.firstName
        ),
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            name="lastName"
            value={editFormData.lastName || ''}
            onChange={handleEditChange}
            size="small"
          />
        ) : (
          params.row.lastName
        ),
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 100,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            name="age"
            value={editFormData.age || ''}
            onChange={handleEditChange}
            size="small"
            type="number"
          />
        ) : (
          params.row.age
        ),
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      valueGetter: (params) =>
        `${params?.row.firstName || ''} ${params?.row.lastName || ''}`,
      width: 160,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleSaveClick} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelClick} color="error">
              <CancelIcon />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => handleEditClick(params.row)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
  );
}
