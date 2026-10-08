// The axios client fires this when a GET is refused with 403; detail is the backend
// page name (the path segment after /api/vN, as in middleware/jwt.go CheckAccess).
export const PAGE_ACCESS_DENIED = "page-access-denied";

export const pageNameFromUrl = (url) => url?.match(/api\/v\d+\/([^/?]+)/)?.[1] || null;
