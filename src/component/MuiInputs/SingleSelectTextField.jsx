import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SingleSelectTextField({ value, onChange, names = [], label,isdisable }) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <FormControl sx={{ width: '100%' }} className="mb-3 ">
      <InputLabel id="group-holding-label">{label}</InputLabel>
      <Select
        labelId="group-holding-label"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        label={label}
        onChange={onChange}
        disabled={isdisable}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {names.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

