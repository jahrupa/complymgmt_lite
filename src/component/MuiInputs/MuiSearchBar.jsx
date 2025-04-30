import { TextField } from '@mui/material'
import React from 'react'

const MuiSearchBar = ({ handleChange, isRequired, fieldName, value, label, type }) => {
    return (
        <TextField id="outlined-basic" label={label} variant="outlined" type={type} name={fieldName}
            value={value}
            required={isRequired}
            onChange={handleChange} className='w-100 mb-3'
            sx={{
                '& .MuiOutlinedInput-input': {
                    padding: '6.3px 14px',
                },
                '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px', // optional, if you want only left rounded
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    top: '-4px',
                  },
                  '& label': {
                    transform: 'translate(14px, 7px) scale(1)', // when not focused
                  },
                  '& label.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -9px) scale(0.75)', // when focused
                  },
            }}
        />
    )
}

export default MuiSearchBar