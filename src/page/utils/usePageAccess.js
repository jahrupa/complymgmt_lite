import { useCallback, useEffect, useState } from "react";
import { fetchAllUserAccessLevels } from "../../api/service";
import { decryptData } from "./encrypt";

const ADMIN_ROLES = ["Admin", "Super-Admin"];
const FULL_ACCESS = { canView: true, canCreate: true, canUpdate: true, canDelete: true };
const NO_ACCESS = { canView: false, canCreate: false, canUpdate: false, canDelete: false };

// Admin and Super-Admin pass every backend page check.
export const isAdminUser = () => ADMIN_ROLES.includes(decryptData(localStorage.getItem("user_role")));

// One request per login session, shared by every caller (sidebar + pages). Keyed on the
// token too, so logging out and back in (no reload) picks up changed grants.
let grantsCache = { key: null, promise: null, resolved: false, grants: null };

const sessionKey = (userId) => `${userId}:${localStorage.getItem("authToken")}`;

// Resolves to the user's grants, or null when they can't be read (network / 5xx).
const loadGrants = (userId) => {
  const key = sessionKey(userId);
  if (grantsCache.key !== key || !grantsCache.promise) {
    const entry = { key, resolved: false, grants: null };
    entry.promise = fetchAllUserAccessLevels({ system_user_id: userId })
      .then((res) => {
        entry.grants = Array.isArray(res) ? res : res?.data || [];
        entry.resolved = true;
        return entry.grants;
      })
      .catch(() => {
        grantsCache = { key: null, promise: null, resolved: false, grants: null }; // retry next time
        return null;
      });
    grantsCache = entry;
  }
  return grantsCache.promise;
};

// Grants already loaded this session, so later pages start resolved instead of "loading"
const cachedState = () => {
  const userId = decryptData(localStorage.getItem("user_id"));
  return userId && grantsCache.resolved && grantsCache.key === sessionKey(userId)
    ? { loading: false, grants: grantsCache.grants, userId }
    : null;
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

// Mirrors common.CheckAccess on the backend for a single record (e.g. one service tracker): any
// active, non-deleted grant for this user on that entity id with the permission flag set.
const entityAccessFromGrants = (grants, entityId, userId) => {
  if (!grants) return FULL_ACCESS; // grants unknown: don't hide, the server still answers 403
  const matching = grants.filter(
    (g) => g.EntityId === entityId && (!g.UserId || g.UserId === userId) && g.IsActive && !g.IsDeleted
  );
  return {
    canView: matching.some((g) => g.view),
    canCreate: matching.some((g) => g.create),
    canUpdate: matching.some((g) => g.update),
    canDelete: matching.some((g) => g.delete),
  };
};

/**
 * Loads the logged-in user's page grants once and returns `accessFor(pageName)` and
 * `entityAccessFor(entityId)`.
 * Admin / Super-Admin always get full access. While loading, everything is denied.
 */
export const usePageAccessResolver = () => {
  const isAdmin = isAdminUser();
  const [state, setState] = useState(() => cachedState() || { loading: !isAdmin, grants: [], userId: null });

  useEffect(() => {
    if (isAdmin || !state.loading) return;
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
  }, [isAdmin, state.loading]);

  const accessFor = useCallback(
    (pageName) => {
      if (isAdmin) return FULL_ACCESS;
      if (state.loading) return NO_ACCESS;
      return accessFromGrants(state.grants, pageName, state.userId);
    },
    [isAdmin, state]
  );

  const entityAccessFor = useCallback(
    (entityId) => {
      if (isAdmin) return FULL_ACCESS;
      if (state.loading || !entityId) return NO_ACCESS;
      return entityAccessFromGrants(state.grants, entityId, state.userId);
    },
    [isAdmin, state]
  );

  return { loading: state.loading, accessFor, entityAccessFor };
};

/**
 * Page-level permissions for the logged-in user. This only drives UI visibility;
 * the server still enforces access.
 */
export const usePageAccess = (pageName) => {
  const { loading, accessFor } = usePageAccessResolver();
  return { loading, ...accessFor(pageName) };
};

/**
 * Permissions on one record, e.g. useEntityAccess("service_tracker", trackerId). The backend
 * matches tracker grants by entity id only (ids are unique), so entityType just documents intent.
 */
export const useEntityAccess = (entityType, entityId) => {
  const { loading, entityAccessFor } = usePageAccessResolver();
  return { loading, ...entityAccessFor(entityId) };
};
