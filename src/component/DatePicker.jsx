import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ResponsiveDatePickers({setSelectedDate, selectedDate}) {
 const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    console.log('Selected date:', newValue ? newValue.format('YYYY-MM-DD') : null);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        sx={{ width: '100%' }}
      />
    </LocalizationProvider>
  );
}
