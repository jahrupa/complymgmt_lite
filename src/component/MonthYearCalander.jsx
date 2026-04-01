import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FormHelperText } from '@material-ui/core';
export default function MonthYearCalander({ label, views, format, value, onChange, error, helperText }) {
  // const [value, setValue] = React.useState(null);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          views={views}
          format={format}
          error={error}
          helperText={helperText}
          // 👉 string → dayjs convert
          value={value ? dayjs(value, format) : null}

          onChange={(newValue) => {
            if (newValue) {
              onChange(dayjs(newValue).format(format)); // 👈 string return
            } else {
              onChange(null);
            }
          }}
          slotProps={{
            textField: {
              error: error,                 // ✅ move here
              helperText: helperText,               // ✅ move here
              sx: {
                '& .css-qru2u2-MuiPickersSectionList-root-MuiPickersInputBase-sectionsContainer-MuiPickersOutlinedInput-sectionsContainer': {
                  direction: 'ltr',
                  padding: '6.5px 0 !important',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: 'inherit',
                  lineHeight: '1.4375em',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                  letterSpacing: 'inherit',
                  width: '182px',
                },
                '& .css-1fb7els-MuiPickersSectionList-root-MuiPickersInputBase-sectionsContainer-MuiPickersOutlinedInput-sectionsContainer': {
                  direction: 'ltr',
                  padding: '6.5px 0 !important',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: 'inherit',
                  lineHeight: '1.4375em',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                  letterSpacing: 'inherit',
                  width: '182px',
                },
                '& .css-1y4gq5a-MuiPickersSectionList-root-MuiPickersInputBase-sectionsContainer-MuiPickersOutlinedInput-sectionsContainer': {
                  direction: 'ltr',
                  padding: '6.5px 0 !important',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: 'inherit',
                  lineHeight: '1.4375em',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                  letterSpacing: 'inherit',
                  width: '135px',
                },
                '& .css-19qnlrw-MuiFormLabel-root-MuiInputLabel-root': {
                  top: '-8px',
                },
              },
            },
          }}
        />
      </LocalizationProvider>

    </>

  );
}

