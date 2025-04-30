import { TextField } from '@mui/material'
import React from 'react'

const MuiTextField = ({handleChange,isRequired,fieldName,value,label ,type,isdisabled}) => {
    return (
            <TextField  id="outlined-basic" label={label} variant="outlined" type={type} name={fieldName}
                value={value}
                required={isRequired}
                disabled={isdisabled}
                onChange={handleChange} className='w-100 mb-3' />
    )
}

export default MuiTextField