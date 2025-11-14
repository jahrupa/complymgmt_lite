import API from "./axios";
import {
  CREATE_COMPANY,
  DELETE_COMPANY_BY_ID,
  GET_ALL_COMPANY,
  GET_GROUP_HOLDING_BY_NAME,
  UPDATE_COMPANY_BY_ID,
  GET_ALL_LOCATION,
  CREATE_LOCATION,
  UPDATE_LOCATION_BY_ID,
  DELETE_LOCATION_BY_ID,
  GET_ALL_COMPANY_NAME,
  GET_ALL_GROUP,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  GET_ALL_USER,
  DELETE_USER_BY_ID,
  GET_ALL_ROLE_NAME,
  CREATE_USER,
  GET_LOCATION_NAME,
  GET_COMPANY_BY_GROUP_HOLDING_ID,
  GET_ALL_MODULE,
  UPDATE_GROUP_STATUS,
  UPDATE_COMPANY_STATUS_BY_ID,
  UPDATE_LOCATION_STATUS_BY_ID,
  LOGIN_API,
  GET_COMPANY_NAME_BY_GROUP_ID,
  CREATE_MODELE,
  UPDATE_MODULE_STATUS_BY_ID,
  UPDATE_MODULE_BY_ID,
  DELETE_MODULE_BY_ID,
  GET_ALL_SUB_MODULE,
  CREATE_SUB_MODULE,
  UPDATE_SUB_MODULE_STATUS_BY_ID,
  VIEW_MODULE_NAME,
  DELETE_SUB_MODULE_BY_ID,
  UPDATE_SUB_MODULE_BY_ID,
  GET_ALL_SERVICE_TRACKER,
  GET_LOCATION_BY_COMPANY_ID,
  UPDATE_USER_BY_ID,
  UPDATE_USER_STATUS_BY_ID,
  GET_ALL_ROLE,
  DELETE_ROLE_BY_ID,
  CREATE_ROLE,
  UPDATE_ROLE_BY_ID,
  UPDATE_ROLE_STATUS_BY_ID,
  VIEW_LOCATION_TO_MODULE_ID,
  CREATE_LOCATION_TO_MODULE,
  UPDATE_LOCATION_TO_MODULE_BY_ID,
  GET_ALL_LOCATION_TO_MODULE,
  UPDATE_LOCATION_TO_MODULE_STATUS_BY_ID,
  DELETE_LOCATION_TO_MODULE_BY_ID,
  GET_SUB_MODULE_NAME_BY_MODULE_ID,
  AUTO_FILE_UPLOAD_PYTHON,
  DELETE_SERVICE_TRACKER_BY_ID,
  UPDATE_SERVICE_TRACKER,
  CREATE_SERVICE_TRACKER,
  UPDATE_SERVICE_TRACKER_BY_STATUS_ID,
  GET_USER_ACCESS_LEVEL_BY_USER_ID,
  CREATE_USER_ACCESS_LEVEL,
  UPDATE_USER_ACCESS_LEVEL,
  DELETE_USER_ACCESS_LEVEL,
  UPLOAD_EXCEL,
  GET_ALL_INNER_PAGE_SERVICE_TRACKER,
  GET_ALL_SERVICE_TRACKER_NAME,
  GET_ALL_SERVICE_TRACKER_FIELDS,
  CREATE_SERVICE_TRACKER_SPECIFICS,
  GET_ALL_ACCESS_TYPES,
  TOGGLE_USER_ACCESS_LEVEL_STATUS,
  GET_ALL_PAGE,
  GET_USER_ACCESS_BY_ID,
  UPDATE_SERVICE_TRACKER_DATA,
  BULK_APPROVE_ALL_SERVICE_TRACKER_DATA,
  APPROVE_ALL_BY_ENTITY_TYPE,
  GET_ALL_SERVICE_TRACKER_SHEET_DATA,
  UPDATE_USER_APPROVAL_STATUS_BY_ID,
  UPDATE_GROUP_APPROVAL_STATUS_BY_ID,
  UPDATE_COMPANY_APPROVAL_STATUS_BY_ID,
  UPDATE_COMPANY_LOCATION_APPROVAL_STATUS_BY_ID,
  UPDATE_MODULE_APPROVAL_STATUS_BY_ID,
  UPDATE_LOCATION_TO_MODULES_APPROVAL_STATUS_BY_ID,
  UPDATE_APPROVAL_STATUS_SUBMODULES_BY_ID,
  APPROVE_USER_ACCESS,
  UPDATE_SERVICE_TRACKER_APPROVAL_STATUS_BY_ID,
  AUTO_FILE_UPLOAD_GOLANG,
  GET_ALL_FILES,
  DELETE_FILE_ID,
  UPDATE_FILE,
  GET_ALL_NOTIFICATION_TEMPLATE,
  CREATE_NOTIFICATION_TEMPLATE,
  UPDATE_NOTIFICATION_TEMPLATE,
  DELETE_NOTIFICATION_TEMPLATE_BY_ID,
  UPDATE_NOTIFICATION_TEMPLATE_APPROVAL_STATUS_BY_ID,
  CREATE_NOTIFICATION,
  GET_ALL_NOTIFICATION,
  DELETE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_APPROVAL_STATUS_BY_ID,
  UPDATE_NOTIFICATION_STATUS_BY_ID,
  UPLOAD_BULK_NOTIFICATION,
  GET_SERVICE_TRACKER_BY_SUBMODULE_ID,
  GET_DOCUMENT_DROPDOWNS_TYPES,
  GET_DOCUMENT_DROPDOWNS_STAGE,
  CHANGE_PASSWORD_AFTER_LOGIN,
  GET_INAPP_NOTIFICATION,
  READ_INAPP_NOTIFICATION,
  DELETE_INAPP_NOTIFICATION,
  DELETE_ALL_INAPP_NOTIFICATION,
  READ_ALL_INAPP_NOTIFICATION,
  GET_COMPLIANCE_COCKPIT_BY_COMPANY,
  GET_COCKPIT_COMPLIANCE_PORTFOLIO,
  GET_GENERAL_COMPLIANCE_PORTFOLIO,
  GET_CLIENT_ONBOARDING_PORTFOLIO,
  CHANGE_TEMPORARY_PASSWORD_STATUS,
  FORGET_PASSWORD,
  GET_INVESTMENT_DECLARATION_STATUS_BY_COMPANY,
  GET_DISTRIBUTION_OF_EMPLOYEE_ACROSS_MULTIPLE_ENTITIES_OR_LOCATIONS,
  GET_GENERAL_COMPLIANCE_BY_COMPANY,
  GET_CLIENT_ONBOARDING_BY_COMPANY,
  GET_TYPE_OF_SYSTEMS_USED_BY_EMPLOYER,
  GET_TOTAL_EMPLOYEE_COUNT,
  GET_PAYROLLS_CLOSED_ON_OR_AHEAD_OF_SLA_PERCENTAGE,
  GET_AVERAGE_DELAY_BETWEEN_DATA_REQUEST_DATE_AND_CLIENT_DATA_RECEIVED_DATE,
  GET_EXPLANATION_OF_EMPLOYEE_COUNT,

} from "./Endpoint";

// Login Api
export const loginApi = async (loginPayload) => {
  try {
    const response = await API.post(LOGIN_API, loginPayload);
    return response.data;
  } catch (error) {
    console.error("Login Error :", error);
    throw error;
  }
}

// Company Api
export const fetchAllCompanies = async () => {
  try {
    const response = await API.get(GET_ALL_COMPANY);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const fetchAllCompaniesName = async () => {
  try {
    const response = await API.get(GET_ALL_COMPANY_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies name:", error);
    throw error;
  }
};

export const fetchCompaniesNameByGroupId = async (id) => {
  try {
    const response = await API.get(`${GET_COMPANY_NAME_BY_GROUP_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies name by group id:", error);
    throw error;
  }
};

export const createCompany = async (companyData) => {
  try {
    const response = await API.post(CREATE_COMPANY, companyData);
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

export const updateCompanyById = async (id, companyData) => {
  try {
    const response = await API.put(`${UPDATE_COMPANY_BY_ID}${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const updateCompanyStatusById = async (id, companyData) => {
  try {
    const response = await API.put(`${UPDATE_COMPANY_STATUS_BY_ID}${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error updating company status:", error);
    throw error;
  }
};

export const deleteCompanyById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_COMPANY_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const getCompanyByGroupId = async (id) => {
  try {
    const response = await API.get(`${GET_COMPANY_BY_GROUP_HOLDING_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching company by group ID:", error);
    throw error
  }
};

export const updateCompanyApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_COMPANY_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating company approval status:", error);
    throw error;
  }
};

// Group Holding Api
export const fetchAllGroupHolding = async () => {
  try {
    const response = await API.get(GET_GROUP_HOLDING_BY_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching group holding name:", error);
    throw error;
  }
};
export const updateGroupStatusById = async (id, groupData) => {
  try {
    const response = await API.put(`${UPDATE_GROUP_STATUS}${id}`, groupData);
    return response.data;
  } catch (error) {
    console.error("Error updating gropu/holding:", error);
    throw error;
  }
};


// lOCATION API

export const fetchAllLocation = async () => {
  try {
    const response = await API.get(GET_ALL_LOCATION);
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};

export const fetchAllLocationName = async () => {
  try {
    const response = await API.get(GET_LOCATION_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching location name:", error);
    throw error;
  }
};

export const createLocation = async (locationData) => {
  try {
    const response = await API.post(CREATE_LOCATION, locationData);
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
}

export const updateLocationById = async (id, locationData) => {
  try {
    const response = await API.put(`${UPDATE_LOCATION_BY_ID}${id}`, locationData);
    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const updateLocationStatusById = async (id, locationData) => {
  try {
    const response = await API.put(`${UPDATE_LOCATION_STATUS_BY_ID}${id}`, locationData);
    return response.data;
  } catch (error) {
    console.error("Error updating location status:", error);
    throw error;
  }
};

export const deleteLocationById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_LOCATION_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};

export const getLocationByCompanyId = async (id) => {
  try {
    const response = await API.get(`${GET_LOCATION_BY_COMPANY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Location by company ID:", error);
    throw error
  }
};

export const updateCompanyLocationApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_COMPANY_LOCATION_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating company location approval status:", error);
    throw error;
  }
};

// Group Holding
export const fetchAllGroup = async () => {
  try {
    const response = await API.get(GET_ALL_GROUP);
    return response.data;
  } catch (error) {
    console.error("Error fetching group:", error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await API.post(CREATE_GROUP, groupData);
    return response.data;
  } catch (error) {
    console.error("Error creating Group:", error);
    throw error;
  }
}

export const updateGroupById = async (id, groupData) => {
  try {
    const response = await API.put(`${UPDATE_GROUP}${id}`, groupData);
    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const deleteGroupById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_GROUP}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const updateGroupApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_GROUP_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating group approval status:", error);
    throw error;
  }
};


// user API
export const fetchAllUser = async () => {
  try {
    const response = await API.get(GET_ALL_USER);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const fetchAllUserName = async () => {
  try {
    const response = await API.get(GET_ALL_ROLE_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching user Name:", error);
    throw error;
  }
};
export const deleteUserById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_USER_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await API.post(CREATE_USER, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export const updateUserById = async (id, userData) => {
  try {
    const response = await API.put(`${UPDATE_USER_BY_ID}${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
export const updateUserStatusId = async (id, userData) => {
  try {
    const response = await API.put(`${UPDATE_USER_STATUS_BY_ID}${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUserApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_USER_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating user approval status:", error);
    throw error;
  }
};

// user role API
export const fetchAllRole = async () => {
  try {
    const response = await API.get(GET_ALL_ROLE);
    return response.data;
  } catch (error) {
    console.error("Error fetching role:", error);
    throw error;
  }
};
export const fetchAllRoleName = async () => {
  try {
    const response = await API.get(GET_ALL_ROLE_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching user role Name:", error);
    throw error;
  }
};
export const deleteRoleById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_ROLE_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user ROLE:", error);
    throw error;
  }
};

export const createRole = async (userRoleData) => {
  try {
    const response = await API.post(CREATE_ROLE, userRoleData);
    return response.data;
  } catch (error) {
    console.error("Error creating user ROLE:", error);
    throw error;
  }
}

export const updateRoleById = async (id, userRoleData) => {
  try {
    const response = await API.put(`${UPDATE_ROLE_BY_ID}${id}`, userRoleData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
export const updateRoleStatusId = async (id, userRoleData) => {
  try {
    const response = await API.put(`${UPDATE_ROLE_STATUS_BY_ID}${id}`, userRoleData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};


// Modules
export const fetchAllModule = async () => {
  try {
    const response = await API.get(GET_ALL_MODULE);
    return response.data;
  } catch (error) {
    console.error("Error fetching Module:", error);
    throw error;
  }
};
export const fetchAllModulesName = async () => {
  try {
    const response = await API.get(VIEW_MODULE_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching Modules name:", error);
    throw error;
  }
};
export const fetchAllModulesNameByLocationId = async (id) => {
  try {
    const response = await API.get(`${VIEW_LOCATION_TO_MODULE_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Modules name by location id:", error);
    throw error;
  }
};
export const createModule = async (modulePayload) => {
  try {
    const response = await API.post(CREATE_MODELE, modulePayload);
    return response.data;
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
}

export const updateModuleStatusById = async (id, moduleStatus) => {
  try {
    const response = await API.put(`${UPDATE_MODULE_STATUS_BY_ID}${id}`, moduleStatus);
    return response.data;
  } catch (error) {
    console.error("Error updating module status:", error);
    throw error;
  }
};
export const updateModuleById = async (id, moduleData) => {
  try {
    const response = await API.put(`${UPDATE_MODULE_BY_ID}${id}`, moduleData);
    return response.data;
  } catch (error) {
    console.error("Error updating module by id:", error);
    throw error;
  }
};
export const deleteModuleById = async (id, moduleData) => {
  try {
    const response = await API.delete(`${DELETE_MODULE_BY_ID}${id}`, moduleData);
    return response.data;
  } catch (error) {
    console.error("Error delete module by id:", error);
    throw error;
  }
};

export const updateModuleApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_MODULE_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating module approval status:", error);
    throw error;
  }
}

// Sub-Module

export const fetchAllSubModule = async () => {
  try {
    const response = await API.get(GET_ALL_SUB_MODULE);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub Module:", error);
    throw error;
  }
};
export const fetchAllSubModuleNameByModuleId = async (id) => {
  try {
    const response = await API.get(`${GET_SUB_MODULE_NAME_BY_MODULE_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub Module name by module id:", error);
    throw error;
  }
};

export const createsSubModule = async (subModulePayload) => {
  try {
    const response = await API.post(CREATE_SUB_MODULE, subModulePayload);
    return response.data;
  } catch (error) {
    console.error("Error creating SUB module:", error);
    throw error;
  }
}
export const updateSubModuleById = async (id, subModuleUpdate) => {
  try {
    const response = await API.put(`${UPDATE_SUB_MODULE_BY_ID}${id}`, subModuleUpdate);
    return response.data;
  } catch (error) {
    console.error("Error updating sub module:", error);
    throw error;
  }
};
export const updateSubModuleStatusById = async (id, subModuleStatus) => {
  try {
    const response = await API.put(`${UPDATE_SUB_MODULE_STATUS_BY_ID}${id}`, subModuleStatus);
    return response.data;
  } catch (error) {
    console.error("Error updating sub module status:", error);
    throw error;
  }
};
export const deleteSubModuleById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_SUB_MODULE_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sub-module:", error);
    throw error;
  }
};

export const updateSubModuleApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_APPROVAL_STATUS_SUBMODULES_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating sub module approval status:", error);
    throw error;
  }
}

// Service Tracker
export const fetchAllServiceTracker = async () => {
  try {
    const response = await API.get(GET_ALL_SERVICE_TRACKER);
    return response.data;
  } catch (error) {
    console.error("Error fetching service tracker:", error);
    throw error;
  }
};
export const fetchAllServiceTrackerFields = async (tracker_name) => {
  try {
    const response = await API.get(`${GET_ALL_SERVICE_TRACKER_FIELDS}${encodeURIComponent(tracker_name)}/fields`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service tracker fields:", error);
    throw error;
  }
};
export const fetchAllInnerPageServiceTracker = async (trackerName, sheetName) => {
  try {
    const url = `${GET_ALL_INNER_PAGE_SERVICE_TRACKER}/${encodeURIComponent(trackerName)}/data?sheet=${encodeURIComponent(sheetName)}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching inner page service tracker:", error);
    throw error;
  }
};

export const fetchAllServiceTrackerName = async () => {
  try {
    const response = await API.get(GET_ALL_SERVICE_TRACKER_NAME);
    return response.data;
  } catch (error) {
    console.error("Error fetching service tracker names:", error);
    throw error;
  }
};

export const deleteServiceTrackerById = async (id, payload) => {
  try {
    const response = await API.delete(`${DELETE_SERVICE_TRACKER_BY_ID}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error delete service tracker:", error);
    throw error;
  }
};
export const updateServiceTrackerById = async (id, payload) => {
  try {
    const response = await API.put(`${UPDATE_SERVICE_TRACKER}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error update service tracker:", error);
    throw error;
  }
};
export const updateServiceTrackerData = async (id, tracker_name, payload) => {
  try {
    const response = await API.put(`${UPDATE_SERVICE_TRACKER_DATA}${tracker_name}/data/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating service tracker data:", error);
    throw error;
  }
};

export const bulkApproveAllServiceTrackerData = async (tracker_name, payload) => {
  try {
    const response = await API.put(`${BULK_APPROVE_ALL_SERVICE_TRACKER_DATA}${tracker_name}/data/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error bulk approving service tracker data:", error);
    throw error;
  }
};

export const createServiceTracker = async (payload) => {
  try {
    const response = await API.post(`${CREATE_SERVICE_TRACKER}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error create sevice tracker:", error);
    throw error;
  }
};

export const createServiceTrackerSpecifics = async (payload) => {
  try {
    const response = await API.post(`${CREATE_SERVICE_TRACKER_SPECIFICS}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating service tracker specifics:", error);
    throw error;
  }
};

export const updateServiceTrackerByStatusId = async (id, payload) => {
  try {
    const response = await API.put(`${UPDATE_SERVICE_TRACKER_BY_STATUS_ID}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error update sevice tracker status:", error);
    throw error;
  }
};

export const fetchAllServiceTrackerSheetData = async (trackerName) => {
  try {
    // const response = await API.get(GET_ALL_SERVICE_TRACKER_SHEET_DATA);
    const url = `${GET_ALL_SERVICE_TRACKER_SHEET_DATA}/${encodeURIComponent(trackerName)}/sheets`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching service tracker sheet data:", error);
    throw error;
  }
};

export const updateServiceTrackerApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_SERVICE_TRACKER_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating service tracker approval status:", error);
    throw error;
  }
};


export const fetchServiceTrackerBySubModuleId = async (id) => {
  try {
    const response = await API.get(`${GET_SERVICE_TRACKER_BY_SUBMODULE_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service tracker by sub module ID:", error);
    throw error;
  }
}
// location To Module

export const fetchLocationToModuleModule = async () => {
  try {
    const response = await API.get(GET_ALL_LOCATION_TO_MODULE);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub Module:", error);
    throw error;
  }
};

export const createsLocationToModule = async (payload) => {
  try {
    const response = await API.post(CREATE_LOCATION_TO_MODULE, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating Location To module:", error);
    throw error;
  }
}

export const updateLocationToModuleById = async (id, payload) => {
  try {
    const response = await API.put(`${UPDATE_LOCATION_TO_MODULE_BY_ID}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating location to module:", error);
    throw error;
  }
};
export const updateLocationToModuleByStatusId = async (id, status) => {
  try {
    const response = await API.put(`${UPDATE_LOCATION_TO_MODULE_STATUS_BY_ID}${id}`, status);
    return response.data;
  } catch (error) {
    console.error("Error updating location to module status:", error);
    throw error;
  }
};
export const deleteLocationToModuleByStatusId = async (id, payload) => {
  try {
    const response = await API.delete(`${DELETE_LOCATION_TO_MODULE_BY_ID}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error delete location to module status:", error);
    throw error;
  }
};

export const updateLocationToModulesApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_LOCATION_TO_MODULES_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating location to module approval status:", error);
    throw error;
  }
};

// File upload python code
export const uploadFile = async (filesArray) => {
  try {
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(AUTO_FILE_UPLOAD_PYTHON, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error);
    throw error;
  }
};


// File upload Golang without python
export const uploadFileGolang = async (filesArray) => {
  try {
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(AUTO_FILE_UPLOAD_GOLANG, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error);
    throw error;
  }
};

// File upload Golang uncomment when you upload auto file whith python code
// export const uploadFileGolang = async ({ files, previousResponse }) => {
//   try {
//     const formData = new FormData();

//     // Append files to FormData
//     files?.forEach((file) => {
//       formData?.append("files", file);
//     });

//     // Append the previous API response as a JSON string
//     formData?.append("previousResponse", JSON.stringify(previousResponse));

//     const response = await API.post(AUTO_FILE_UPLOAD_GOLANG, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Upload failed:", error.response?.data || error);
//     throw error;
//   }
// };

export const uploadExcelFile = async (filesArray, metadata = {}) => {
  try {
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append("file", file);
    });

    // Append other fields
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await API.post(UPLOAD_EXCEL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error);
    throw error;
  }
};

export const deleteFileById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_FILE_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting file by ID:", error);
    throw error;
  }
};
export const fetchAllFiles = async () => {
  try {
    const response = await API.get(GET_ALL_FILES);
    return response.data;
  } catch (error) {
    console.error("Error fetching all files:", error);
    throw error;
  }
};
export const updateFileById = async (id, fileData) => {
  try {
    const response = await API.put(`${UPDATE_FILE}${id}`, fileData);
    return response.data;
  } catch (error) {
    console.error("Error updating file by ID:", error);
    throw error;
  }
};

export const fetchDocumentDropdownTypes = async (service_tracker_name) => {
  try {
    const response = await API.get(`${GET_DOCUMENT_DROPDOWNS_TYPES}${service_tracker_name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document dropdown types:", error);
    throw error;
  }
};
export const fetchDocumentDropdownStages = async (service_tracker_name) => {
  try {
    const response = await API.get(`${GET_DOCUMENT_DROPDOWNS_STAGE}${service_tracker_name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document dropdown stages:", error);
    throw error;
  }
};
// USER ACCESS LEVEL
export const fetchAllUserAccessLevels = async ({ system_user_id }) => {
  try {
    const response = await API.get(`${GET_USER_ACCESS_LEVEL_BY_USER_ID}/${system_user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user access levels:", error);
    throw error;
  }
};
export const fetchUserAccessById = async (id) => {
  try {
    const response = await API.get(`${GET_USER_ACCESS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user access by ID:", error);
    throw error;
  }
};
export const fetchAllAccessTypes = async () => {
  try {
    const response = await API.get(GET_ALL_ACCESS_TYPES);
    return response.data;
  } catch (error) {
    console.error("Error fetching access types:", error);
    throw error;
  }
};
export const createUserAccessLevel = async (userAccessData) => {
  try {
    const response = await API.post(CREATE_USER_ACCESS_LEVEL, userAccessData);
    return response.data;
  } catch (error) {
    console.error("Error creating user access level:", error);
    throw error;
  }
};
export const updateUserAccessLevelById = async (id, userAccessData) => {
  try {
    const response = await API.put(`${UPDATE_USER_ACCESS_LEVEL}${id}`, userAccessData);
    return response.data;
  } catch (error) {
    console.error("Error updating user access level:", error);
    throw error;
  }
};
export const deleteUserAccessLevelById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_USER_ACCESS_LEVEL}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user access level:", error);
    throw error;
  }
};
export const toggleUserAccessLevelStatus = async (id, status) => {
  try {
    const response = await API.put(`${TOGGLE_USER_ACCESS_LEVEL_STATUS}${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error toggling user access level status:", error);
    throw error;
  }
};

export const approveUserAccess = async (id) => {
  try {
    const response = await API.put(`${APPROVE_USER_ACCESS}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error approving user access:", error);
    throw error;
  }
};

// All pages
export const fetchAllPages = async () => {
  try {
    const response = await API.get(GET_ALL_PAGE);
    return response.data;
  } catch (error) {
    console.error("Error fetching all pages:", error);
    throw error;
  }
};

// Common API For Approve All
export const bulkApproveAllPageData = async (page_name) => {
  try {
    const response = await API.put(`${APPROVE_ALL_BY_ENTITY_TYPE}${page_name}/update/approve/all`);
    return response.data;
  } catch (error) {
    console.error("Error approving all service tracker data:", error);
    throw error;
  }
};

// Notification APIs

export const createNotificationTemplate = async (templateData) => {
  try {
    const response = await API.post(CREATE_NOTIFICATION_TEMPLATE, templateData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification template:", error);
    throw error;
  }
};
export const fetchAllNotificationTemplates = async () => {
  try {
    const response = await API.get(GET_ALL_NOTIFICATION_TEMPLATE);
    return response.data;
  } catch (error) {
    console.error("Error fetching all notification templates:", error);
    throw error;
  }
};
export const updateNotificationTemplate = async (id, templateData) => {
  try {
    const response = await API.put(`${UPDATE_NOTIFICATION_TEMPLATE}${id}`, templateData);
    return response.data;
  } catch (error) {
    console.error("Error updating notification template:", error);
    throw error;
  }
};

export const deleteNotificationTemplateById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_NOTIFICATION_TEMPLATE_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification template:", error);
    throw error;
  }
};
export const updateNotificationTemplateApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_NOTIFICATION_TEMPLATE_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating notification template approval status:", error);
    throw error;
  }
};
// notification
export const createNotification = async (notificationData) => {
  try {
    const response = await API.post(CREATE_NOTIFICATION, notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
export const fetchAllNotifications = async () => {
  try {
    const response = await API.get(GET_ALL_NOTIFICATION);
    return response.data;
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    throw error;
  }
};
export const deleteNotificationById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_NOTIFICATION_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
export const updateNotificationById = async (id, notificationData) => {
  try {
    const response = await API.put(`${UPDATE_NOTIFICATION_BY_ID}${id}`, notificationData);
    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};


export const updateNotificationApprovalStatusById = async (id) => {
  try {
    const response = await API.put(`${UPDATE_NOTIFICATION_APPROVAL_STATUS_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating notification approval status:", error);
    throw error;
  }
};


export const updateNotificationStatusById = async (id, status) => {
  try {
    const response = await API.put(`${UPDATE_NOTIFICATION_STATUS_BY_ID}${id}`, status);
    return response.data;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
};

export const uploadBulkNotification = async (filesArray, id, metadata = {}) => {
  try {
    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("metadata", JSON.stringify(metadata));

    const response = await API.post(`${UPLOAD_BULK_NOTIFICATION}${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading bulk notification:", error);
    throw error;
  }
};

export const getInAppNotification = async (userId) => {
  try {
    const response = await API.get(GET_INAPP_NOTIFICATION, {
      params: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notification:", error);
    throw error;
  }
}

export const readNotificationById = async (id) => {
  try {
    const response = await API.put(`${READ_INAPP_NOTIFICATION}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating notification", error);
    throw error;
  }
}

export const deleteInAppNotificationById = async (id) => {
  try {
    const response = await API.delete(`${DELETE_INAPP_NOTIFICATION}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error clearing notification", error);
    throw error;
  }
}

export const readAllInAppNotification = async (user_id) => {
  try {
    const response = await API.put(`${READ_ALL_INAPP_NOTIFICATION}`,
      {},
      { params: { user_id: user_id } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating notification", error);
    throw error;
  }
}

export const deleteAllInAppNotification = async (user_id) => {
  try {
    const response = await API.delete(`${DELETE_ALL_INAPP_NOTIFICATION}`, {
      params: { user_id: user_id }
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing notification", error);
    throw error;
  }
}

// change password
export const changePassword = async (userId, passwords) => {
  try {
    const response = await API.put(`${CHANGE_PASSWORD_AFTER_LOGIN}${userId}`, passwords);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Forget password
export const forgetPassword = async (email) => {
  try {
    const response = await API.post(`${FORGET_PASSWORD}`, email);
    return response.data;
  } catch (error) {
    console.error("Error in forget password:", error);
    throw error;
  }
}
export const changeTemporaryPasswordStatus = async (user_credential) => {
  try {
    const response = await API.get(`${CHANGE_TEMPORARY_PASSWORD_STATUS}${user_credential}`);
    return response.data;
  } catch (error) {
    console.error("Error changing temporary password status:", error);
    throw error;
  }
}
// Dashboard
export const fetchGeneralCompaiancePortfolio = async () => {
  try {
    const response = await API.get(GET_GENERAL_COMPLIANCE_PORTFOLIO);
    return response.data;
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    throw error;
  }
};

export const fetchGeneralComplianceByCompany = async (company_name) => {
  try {
    const response = await API.get(`${GET_GENERAL_COMPLIANCE_BY_COMPANY}company?company_name=${encodeURIComponent(company_name)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all General Compliance By Company:", error);
    throw error;
  }
};

export const fetchComplainceCockpitByCompany = async (company_name) => {
  try {
    const response = await API.get(`${GET_COMPLIANCE_COCKPIT_BY_COMPANY}company?company_name=${encodeURIComponent(company_name)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Complaince Cockpit By Company:", error);
    throw error;
  }
};


export const fetchCockPitCompliancePortfolio = async () => {
  try {
    const response = await API.get(GET_COCKPIT_COMPLIANCE_PORTFOLIO);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Client", error);
    throw error;
  }
};


export const fetchClientOnboardingPortfolio = async () => {
  try {
    const response = await API.get(GET_CLIENT_ONBOARDING_PORTFOLIO);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Client", error);
    throw error;
  }
};

export const fetchClientOnboardingByCompany = async (company_name) => {
  try {
    const response = await API.get(`${GET_CLIENT_ONBOARDING_BY_COMPANY}company?company_name=${encodeURIComponent(company_name)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Client Onboarding By Company", error);
    throw error;
  }
};
export const fetchComplainceCockpit = async () => {
  try {
    const response = await API.get(GET_COCKPIT_COMPLIANCE_PORTFOLIO);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Complaince Cockpit", error);
    throw error;
  }
};

// Dashboard For Payroll
export const fetchInvestmentDeclarationStatusByCompany = async (company_name) => {
  try {
    const url = `${GET_INVESTMENT_DECLARATION_STATUS_BY_COMPANY}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Investment Declaration Status By Company", error);
    throw error;
  }
}

export const fetchDistributionOfEmployeeAcrossMultipleEntitiesOrLocations = async (company_name) => {
  try {
    const url = `${GET_DISTRIBUTION_OF_EMPLOYEE_ACROSS_MULTIPLE_ENTITIES_OR_LOCATIONS}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Distribution Of Employee Across Multiple Entities Or Locations", error);
    throw error;
  }
}

export const fetchTypeOfSystemsUsedByEmployer = async (company_name) => {
  try {
    const url = `${GET_TYPE_OF_SYSTEMS_USED_BY_EMPLOYER}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Type Of Systems Used By Employer", error);
    throw error;
  }
}

export const fetchTotalEmployeeCount = async (company_name) => {
  try {
    const url = `${GET_TOTAL_EMPLOYEE_COUNT}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Total Employee Count", error);
    throw error;
  }
}

export const fetchPayrollsClosedOnOrAheadOfSlaPercentage = async (company_name) => {
  try {
    const url = `${GET_PAYROLLS_CLOSED_ON_OR_AHEAD_OF_SLA_PERCENTAGE}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Payrolls Closed On Or Ahead Of Sla Percentage", error);
    throw error;
  }
}

export const fetchAverageDelayBetweenDataRequestDateAndClientDataReceivedDate = async (company_name) => {
  try {
    const url = `${GET_AVERAGE_DELAY_BETWEEN_DATA_REQUEST_DATE_AND_CLIENT_DATA_RECEIVED_DATE}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Average Delay Between Data Request Date And Client Data Received Date", error);
    throw error;
  }
}


export const fetchExplanationOfEmployeeCount = async (company_name) => {
  try {
    const url = `${GET_EXPLANATION_OF_EMPLOYEE_COUNT}${company_name ? `?company_name=${encodeURIComponent(company_name)}` : ''}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Explanation Of Employee Count", error);
    throw error;
  }
}
