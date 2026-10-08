import { isAdminUser } from "../page/utils/usePageAccess";
import NoPageAccess from "./NoPageAccess";

// For admin-only pages (no page grant opens them): everyone else gets the no-access state.
const RequireAdmin = ({ children }) => (isAdminUser() ? children : <NoPageAccess />);

export default RequireAdmin;
