import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ArrowLeft, X } from "lucide-react";
import MultiFileUpload from "../component/MultiFileUpload";
import { useState } from "react";

export default function RegisterMappingPageWithAi({
    anchor = "right",
    open,
    onClose,
    handlePipelineformSubmit,
    setIsGeneratePipeline,
    setUploadedFiles,
    uploadedFiles,

}) {
    const [progress, setProgress] = useState({});
console.log(progress,'progress')
const isUploadComplete =
  Object.values(progress).length > 0 &&
  Object.values(progress).every((p) => p !== 100);
    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: "100vw" } }}
        >
            <Box sx={{ width: "100%", padding: "10px" }}>
                {/* HEADER */}

                <div className="service-tracker-inner-page-header d-flex justify-content-between">
                    <div className="pb-header" onClick={() => {
                        onClose(false);
                        setIsGeneratePipeline(false);
                    }}>
                        <div className="pb-header-icon">
                            <ArrowLeft size={20} onClick={() => {
                                setIsGeneratePipeline(false);
                                onClose(false);
                            }} className="cursor-pointer" style={{ cursor: "pointer" }} />
                        </div>
                        <div>
                            <h1>Pipeline Builder</h1>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="crud_btn" onClick={() => setIsGeneratePipeline(false)}><ArrowLeft size={20} /> Back</button>
                    </div>
                </div>
                <Divider className="mb-3" />

                {/* Error Message */}
                <div className="">
                    <div className="p-5 ">
                        <div style={{ fontSize: 14, marginBottom: 7, color: 'gray' }}>
                            <span>Note: </span>
                            <span>You can upload multiple files at a time</span>
                        </div>
                        <div></div>

                        <MultiFileUpload
                            setUploadedFiles={setUploadedFiles}
                            uploadedFiles={uploadedFiles}
                            MAX_COUNT={1000}
                            MAX_SIZE_MB={5}
                            setProgress={setProgress}
                            progress={progress}
                        />
                        {/* Generating pipeline... This may take a moment. */}
                    </div>



                    <div className="row row-gap-2 mt-3 justify-content-lg-end justify-content-md-end justify-content-center">
                        <div className="col-12 col-md-6 w-auto">
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={() => {
                                    onClose(false)
                                    setIsGeneratePipeline(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="col-12 col-md-6 w-auto">
                            <button type="submit" className="btn btn-primary w-100" onClick={() => {
                                handlePipelineformSubmit();
                                setIsGeneratePipeline(false);
                            }} disabled={isUploadComplete}>Generate</button>
                        </div>
                    </div>
                </div>
            </Box>
        </Drawer>
    );
}
