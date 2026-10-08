import { useCallback, useEffect, useState } from "react";
import { fetchAllUserAccessLevels } from "../../api/service";
import { decryptData } from "./encrypt";

const ADMIN_ROLES = ["Admin", "Super-Admin"];
const FULL_ACCESS = { canView: true, canCreate: true, canUpdate: true, canDelete: true };
const NO_ACCESS = { canView: false, canCreate: false, canUpdate: false, canDelete: false };

// One request per user per session, shared by every caller (sidebar + pages).
let grantsCache = { userId: null, promise: null };

// Resolves to the user's grants, or null when they can't be read.
const loadGrants = (userId) => {
  if (grantsCache.userId !== userId || !grantsCache.promise) {
    grantsCache = {
      userId,
      promise: fetchAllUserAccessLevels({ system_user_id: userId })
        .then((res) => (Array.isArray(res) ? res : res?.data || []))
        .catch(() => {
          // e.g. 403: the grants endpoint itself needs user_access view. Retry next time.
          grantsCache = { userId: null, promise: null };
          return null;
        }),
    };
  }
  return grantsCache.promise;
};

// Mirrors the backend's page check (middleware/jwt.go CheckAccess): an active,
// non-deleted, approved "page" grant for this user with the permission flag set.
const accessFromGrants = (grants, pageName, userId) => {
  // Grants unknown: don't hide the page. The server still answers 403, which
  // RequirePageAccess turns into a "no access" state.
  if (!grants) return FULL_ACCESS;
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
 * Loads the logged-in user's page grants once and returns `accessFor(pageName)`.
 * Admin / Super-Admin always get full access. While loading, everything is denied.
 */
export const usePageAccessResolver = () => {
  const isAdmin = ADMIN_ROLES.includes(decryptData(localStorage.getItem("user_role")));
  const [state, setState] = useState(() => ({ loading: !isAdmin, grants: [], userId: null }));

  useEffect(() => {
    if (isAdmin) return;
    const userId = decryptData(localStorage.getItem("user_id"));
    if (!userId) {
      setState({ loading: false, grants: [], userId: null });
      return;
    }
    let cancelled = false;
    loadGrants(userId).then((grants) => {
      if (!cancelled) setState({ loading: false, grants, userId });
    });
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const accessFor = useCallback(
    (pageName) => {
      if (isAdmin) return FULL_ACCESS;
      if (state.loading) return NO_ACCESS;
      return accessFromGrants(state.grants, pageName, state.userId);
    },
    [isAdmin, state]
  );

  return { loading: state.loading, accessFor };
};

/**
 * Page-level permissions for the logged-in user. This only drives UI visibility;
 * the server still enforces access.
 */
export const usePageAccess = (pageName) => {
  const { loading, accessFor } = usePageAccessResolver();
  return { loading, ...accessFor(pageName) };
};
