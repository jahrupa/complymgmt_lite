import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ArrowLeft, X } from "lucide-react";
import MultiFileUpload from "../component/MultiFileUpload";

export default function RegisterMappingPageWithAi({
    anchor = "right",
    open,
    onClose,
    handlePipelineformSubmit,
    handleDeletePipeline,
    isEditing,
    setIsGeneratePipeline,
    setUploadedFiles,
    uploadedFiles,

}) {


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
                    {/* <div className="d-flex gap-2">
                        <div>
                            <button type="submit" className="crud_btn" style={isEditing === false ? { cursor: "not-allowed" } : {}} onClick={handleDeletePipeline} disabled={isEditing === false}> Delete All</button>
                        </div>
                        <div>
                            <button type="submit" className="crud_btn" onClick={() => setIsGeneratePipeline(true)}> Generate Pipeline</button>
                        </div>
                        <div>
                        </div>
                    </div> */}
                </div>
                <Divider className="mb-3" />

                {/* Error Message */}
                <div className="">

                    <div className="p-5 ">
                        <MultiFileUpload
                            setUploadedFiles={setUploadedFiles}
                            uploadedFiles={uploadedFiles}
                            fileLImitTitle={"You can upload multiple files at a time."}
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
                            }}>Generate</button>
                        </div>
                    </div>
                </div>
            </Box>
        </Drawer>
    );
}
