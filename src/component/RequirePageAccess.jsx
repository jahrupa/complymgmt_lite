import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { usePageAccess } from "../page/utils/usePageAccess";
import { PAGE_ACCESS_DENIED } from "../page/utils/pageAccessEvents";
import NoPageAccess from "./NoPageAccess";

/**
 * Renders the page only if the user can view `page` (the backend page name). Also
 * switches to the no-access state if the server refuses one of that page's reads,
 * so a page never sits there with an empty table after a 403.
 */
const RequirePageAccess = ({ page, children }) => {
    const { loading, canView } = usePageAccess(page);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        const onDenied = (e) => {
            if (e.detail === page) setDenied(true);
        };
        window.addEventListener(PAGE_ACCESS_DENIED, onDenied);
        return () => window.removeEventListener(PAGE_ACCESS_DENIED, onDenied);
    }, [page]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <CircularProgress size={26} />
            </div>
        );
    }

    if (!canView || denied) return <NoPageAccess />;

    return children;
};

export default RequirePageAccess;
