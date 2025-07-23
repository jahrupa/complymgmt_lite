import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MonthYearCalander({label,views}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        // label={'"year", "month" and "day"'}
        // views={['year', 'month', 'day']}
        slotProps={{
          textField: {
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
  );
}

