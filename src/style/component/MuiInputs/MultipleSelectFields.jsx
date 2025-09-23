import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectFields({ placeholder, roleName, onChange }) {
  const theme = useTheme();
  const [selectedIds, setSelectedIds] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    setSelectedIds(newValue);
    onChange?.(newValue); // Optional callback to send selected IDs to parent
  };

  return (
    <div>
      <FormControl sx={{ width: 250 }}>
        <Select
          multiple
          displayEmpty
          value={selectedIds}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <div style={{ color: 'darkslategray', fontSize: '14px' }}>{placeholder}</div>;
            }

            // Display names instead of IDs
            const selectedNames = roleName
              .filter((item) => selected.includes(item.groups_holdings_id))
              .map((item) => item.group_holding_name);
            return selectedNames.join(', ');
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            '& .MuiSelect-select': {
              padding: '6.3px 14px',
            },
          }}
        >
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
          {roleName.map((item) => (
            <MenuItem
              key={item.groups_holdings_id}
              value={item.groups_holdings_id}
              style={getStyles(item.groups_holdings_id, selectedIds, theme)}
            >
              {item.group_holding_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

