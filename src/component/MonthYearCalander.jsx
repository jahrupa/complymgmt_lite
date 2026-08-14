import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Without this plugin dayjs ignores the format argument, so a stored value like
// "August" or "2026" falls through to Date() and comes back Invalid.
dayjs.extend(customParseFormat);

export default function MonthYearCalander({
  label,
  views = ['year', 'month', 'day'],
  format = 'DD/MM/YYYY',
  // What the parent stores/receives, when it differs from what is displayed —
  // e.g. show "May" (format "MMMM") but hand back "5" (outputFormat "M").
  outputFormat,
  value,
  onChange,
  error,
  helperText,
  size = 'small',
  fullWidth = false,
  disabled = false,
}) {
  const valueFormat = outputFormat || format;

  // Stored value is a string/number in `valueFormat`; the picker needs a dayjs object.
  const parsed =
    value === null || value === undefined || value === ''
      ? null
      : dayjs(String(value), valueFormat);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        views={views}
        format={format}
        disabled={disabled}
        value={parsed?.isValid() ? parsed : null}
        onChange={(newValue) => {
          // Fires on every keystroke while typing, so ignore half-typed dates.
          if (!onChange) return;
          onChange(newValue?.isValid() ? newValue.format(valueFormat) : null);
        }}
        slotProps={{
          textField: {
            size,
            fullWidth,
            error: !!error,
            helperText,
          },
          field: { clearable: true },
        }}
        sx={fullWidth ? { width: '100%' } : undefined}
      />
    </LocalizationProvider>
  );
}
