import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import '../../style/useRole.css'
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
    root: {
        "& .MuiTextField-root": {
            // margin: theme.spacing(1),
        },
        "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(14px, -11px) scale(0.75)", 
            background: "white", 
            paddingLeft: "12px", 
            paddingRight: "12px", 

        }
    },
    textarea: {
        resize: "both",
        // maxWidth:''
        
    },
}));

export default function MuiTextAreaField({value,handleChange,name,label}) {
    const classes = useStyles();

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div className="">
                <TextField
                    id="outlined-textarea"
                    label={label}
                    //   placeholder="Placeholder"
                    name={name}
                    value={value}
                    multiline
                    variant="outlined"
                    inputProps={{ className: classes.textarea }}
                    onChange={handleChange}
                    className="text_area_field"
                />
            </div>
        </form>
    );
}




