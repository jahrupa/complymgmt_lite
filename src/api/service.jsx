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
  GET_ALL_Roles_NAME,
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
  GET_ALL_SERVICE_TRACKER

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


// Group Holding
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
    const response = await API.get(GET_ALL_Roles_NAME);
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
    const response = await API.put(`${UPDATE_GROUP}${id}`, userData);
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

