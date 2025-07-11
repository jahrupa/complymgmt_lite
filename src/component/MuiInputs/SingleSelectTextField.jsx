// import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// export default function SingleSelectTextField({ name, value, onChange, names = [], label, isdisable, error, helperText, isRequired }) {
//   const [open, setOpen] = React.useState(false);
//   const handleClose = () => setOpen(false);
//   const handleOpen = () => setOpen(true);
//   console.log(value, 'value')
//   return (
//     <FormControl sx={{ width: '100%' }} className="mb-3 ">
//       <InputLabel id={name}>{label}</InputLabel>
//       <Select
//         labelId={name}
//         open={open}
//         onClose={handleClose}
//         onOpen={handleOpen}
//         value={value}
//         label={label}
//         onChange={onChange}
//         disabled={isdisable}
//         required={isRequired}
//         error={error}
//         helperText={helperText}
//         variant="outlined"
//       >
//         <MenuItem value="">
//           <em>None</em>
//         </MenuItem>
//         {names.map((item) => (
//           <MenuItem key={item._id} value={item.name}>
//             {item.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }


import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

export default function SingleSelectTextField({ name, value, onChange, names = [], label, isdisable, error, helperText, isRequired }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <FormControl sx={{ width: '100%' }} className="mb-3" error={error} required={isRequired}>
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        labelId={name}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        label={label}
        onChange={onChange}
        disabled={isdisable}
        variant="outlined"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {names.map((item) => (
          <MenuItem key={item._id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
