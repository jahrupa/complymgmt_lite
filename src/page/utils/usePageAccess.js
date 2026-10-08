import { useEffect, useState } from "react";
import { fetchAllUserAccessLevels } from "../../api/service";
import { decryptData } from "./encrypt";

const ADMIN_ROLES = ["Admin", "Super-Admin"];
const FULL_ACCESS = { canView: true, canCreate: true, canUpdate: true, canDelete: true };
const NO_ACCESS = { canView: false, canCreate: false, canUpdate: false, canDelete: false };

// One request per user per session, shared by every caller (sidebar + page).
let grantsCache = { userId: null, promise: null };

const loadGrants = (userId) => {
  if (grantsCache.userId !== userId || !grantsCache.promise) {
    grantsCache = {
      userId,
      promise: fetchAllUserAccessLevels({ system_user_id: userId })
        .then((res) => (Array.isArray(res) ? res : res?.data || []))
        .catch(() => {
          // e.g. 403 when the user can't read user_access; retry next time, deny for now.
          grantsCache = { userId: null, promise: null };
          return [];
        }),
    };
  }
  return grantsCache.promise;
};

// Mirrors the backend's page check (middleware/jwt.go CheckAccess): an active,
// non-deleted, approved "page" grant for this user with the permission flag set.
const accessFromGrants = (grants, pageName, userId) => {
  const grant = grants.find(
    (g) =>
      g.EntityType === "page" &&
      g.EntityName === pageName &&
      (!g.UserId || g.UserId === userId) &&
      g.IsActive &&
      !g.IsDeleted &&
      g.Approval_Status === 1
  );
  if (!grant) return NO_ACCESS;
  return {
    canView: !!grant.view,
    canCreate: !!grant.create,
    canUpdate: !!grant.update,
    canDelete: !!grant.delete,
  };
};

/**
 * Page-level permissions for the logged-in user. Admin / Super-Admin always get
 * full access. This only drives UI visibility; the server still enforces access.
 */
export const usePageAccess = (pageName) => {
  const isAdmin = ADMIN_ROLES.includes(decryptData(localStorage.getItem("user_role")));
  const [state, setState] = useState(() =>
    isAdmin ? { loading: false, ...FULL_ACCESS } : { loading: true, ...NO_ACCESS }
  );

  useEffect(() => {
    if (isAdmin) return;
    const userId = decryptData(localStorage.getItem("user_id"));
    if (!userId) {
      setState({ loading: false, ...NO_ACCESS });
      return;
    }
    let cancelled = false;
    loadGrants(userId).then((grants) => {
      if (!cancelled) setState({ loading: false, ...accessFromGrants(grants, pageName, userId) });
    });
    return () => {
      cancelled = true;
    };
  }, [isAdmin, pageName]);

  return state;
};
