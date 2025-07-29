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
  CREATE_SUB_MODELE,
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
  VIEW_MODULE_BY_LOCATION_ID,
  CREATE_LOCATION_TO_MODULE,
  UPDATE_LOCATION_TO_MODULE_BY_ID,
  GET_ALL_LOCATION_TO_MODULE,
  UPDATE_LOCATION_TO_MODULE_STATUS_BY_ID,
  DELETE_LOCATION_TO_MODULE_BY_ID,
  GET_SUB_MODULE_NAME_BY_MODULE_ID,
  FILE_UPLOAD,
  DELETE_SERVICE_TRACKER_BY_ID,
  UPDATE_SERVICE_TRACKER,
  CREATE_SERVICE_TRACKER,
  UPDATE_SERVICE_TRACKER_BY_STATUS_ID

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
    const response = await API.get(`${VIEW_MODULE_BY_LOCATION_ID}${id}` );
    return response.data;
  } catch (error) {
    console.error("Error fetching Modules name by location id:", error);
    throw error;
  }
};
export const createModule= async (modulePayload) => {
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

export const createsSubModule= async (subModulePayload) => {
  try {
    const response = await API.post(CREATE_SUB_MODELE, subModulePayload);
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

export const createServiceTracker = async (payload) => {
  try {
    const response = await API.post(`${CREATE_SERVICE_TRACKER}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error create sevice tracker:", error);
    throw error;
  }
};



export const updateServiceTrackerByStatusId = async (id,payload) => {
  try {
    const response = await API.put(`${UPDATE_SERVICE_TRACKER_BY_STATUS_ID}${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error update sevice tracker status:", error);
    throw error;
  }
};
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

export const createsLocationToModule= async (payload) => {
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
// File upload
export const uploadFile = async (filesArray) => {
  try {
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(FILE_UPLOAD, formData, {
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



