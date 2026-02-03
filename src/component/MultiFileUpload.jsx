import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
const MAX_COUNT = 5;

function MultiFileUpload({ uploadedFiles, setUploadedFiles }) {
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
        // setUploadedFiles(chosenFiles);
    }

    const handleRemoveFile = (fileName) => {
        const updatedFiles = uploadedFiles.filter(
            (file) => file.name !== fileName
        );
        setUploadedFiles(updatedFiles);
        // Re-enable upload if below limit
        if (updatedFiles.length < MAX_COUNT) {
            setFileLimit(false);
        }
    };

    return (
        <div className="">
            <div style={{ fontSize: 14, marginBottom: 7, color: 'gray' }}>
                <span>Note: </span>
                <span>You can upload a maximum of 5 files at a time.</span>
            </div>
            <input id='multi-fileUpload' type='file' multiple
                accept='.xlsx, .xls, .csv, .pdf, .doc, .docx, .png, .jpg, .jpeg'
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
                    <div className="mt-2 uploaded_file_name d-flex">
                        <span><TextSnippetIcon /></span>
                        <snap className='w-100'>{file.name}</snap>

                        <div className='d-flex justify-content-end'>
                            <button
                                type="button"
                                style={{ display: 'contents', cursor: 'pointer' }}
                                onClick={() => handleRemoveFile(file.name)}
                            >
                                x
                            </button>
                        </div>


                    </div>
                ))}
            </div>

        </div>
    );
}

export default MultiFileUpload;
