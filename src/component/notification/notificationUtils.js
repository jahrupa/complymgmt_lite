// The navbar badge shows unread notifications; the API returns read and unread ones together
export const countUnread = (notifications) =>
    (Array.isArray(notifications) ? notifications : []).filter((n) => n && !n.is_read).length;
