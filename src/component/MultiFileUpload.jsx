import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const MAX_COUNT = 5;

function MultiFileUpload() {

    const [uploadedFiles, setUploadedFiles] = useState([])
    const [fileLimit, setFileLimit] = useState(false);


    const handleUploadFiles = files => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedFiles(uploaded)

    }

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFiles(chosenFiles);
    }

    return (
        <div className="">
            <div style={{fontSize:14,marginBottom:7,color:'gray'}}>
                <span>Note: </span>
                <span>You can upload a maximum of 5 files at a time.</span>
            </div>
            <input id='multi-fileUpload' type='file' multiple
                accept='application/pdf, image/png'
                onChange={handleFileEvent}
                disabled={fileLimit}
                className="upload_file_input"
            />

            <label htmlFor='multi-fileUpload' className="upload_button">
                <span className="me-2 upload_file_icon"><CloudUploadIcon /></span>Upload File
                {/* <a  className={`btn btn-primary ${!fileLimit ? '' : 'disabled' } `}>Upload Files</a> */}
            </label>

            <div className="uploaded-files-list">
                {uploadedFiles.map(file => (
                    <div >
                        {file.name}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default MultiFileUpload;
