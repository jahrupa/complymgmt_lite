// Login
export const LOGIN_API ='/api/v1/login';

// Roles
export const GET_ALL_ROLE ='/view_all_roles';
export const DELETE_ROLE_BY_ID ='/delete_role_by_id/';
export const CREATE_ROLE ='/create_role';
export const UPDATE_ROLE_BY_ID ='update_role_by_id/';
export const UPDATE_ROLE_STATUS_BY_ID='/update_role_status_by_id/';
export const GET_ALL_ROLE_NAME='/view_role_names';

// user
export const GET_ALL_USER ='/api/v1/user/view/multiple';
export const DELETE_USER_BY_ID ='/api/v1/user/delete/';
export const CREATE_USER ='/api/v1/user/create';
export const UPDATE_USER_BY_ID ='/api/v1/user/update/';
export const UPDATE_USER_STATUS_BY_ID='/api/v1/user/update/status/';
export const UPDATE_USER_APPROVAL_STATUS_BY_ID='/api/v1/user/update/approval_status/';

// Company
export const CREATE_COMPANY ='/api/v1/company/create';
export const UPDATE_COMPANY_BY_ID ='/api/v1/company/update/';
export const UPDATE_COMPANY_STATUS_BY_ID='/api/v1/company/update/status/';
export const GET_ALL_COMPANY ='/api/v1/company/view/multiple';
export const DELETE_COMPANY_BY_ID ='/api/v1/company/delete/';
export const GET_ALL_COMPANY_NAME ='/api/v1/company/view/names/multiple';
export const GET_COMPANY_NAME_BY_GROUP_ID ='/api/v1/company/view/group/multiple/';
export const GET_COMPANY_BY_ID ='/api/v1/company/view/id/';
export const UPDATE_COMPANY_APPROVAL_STATUS_BY_ID = '/api/v1/company/update/approval_status/';

// Group Holding
export const GET_GROUP_HOLDING_BY_NAME ='/api/v1/group/view/names/multiple';
export const GET_ALL_GROUP ='/api/v1/group/view/multiple';
export const CREATE_GROUP ='/api/v1/group/create';
export const UPDATE_GROUP ='/api/v1/group/update/';
export const DELETE_GROUP ='/api/v1/group/delete/';
export const GET_COMPANY_BY_GROUP_HOLDING_ID ='/get_company_by_group_id/';
export const UPDATE_GROUP_STATUS ='/api/v1/group/update/status/';
export const GET_GROUP_BY_ID ='/api/v1/group/view/id/';
export const UPDATE_GROUP_APPROVAL_STATUS_BY_ID = '/api/v1/group/update/approval_status/';

// Location
export const GET_ALL_LOCATION='/api/v1/company_location/view/multiple';
export const CREATE_LOCATION='/api/v1/company_location/create';
export const UPDATE_LOCATION_BY_ID='/api/v1/company_location/update/';
export const DELETE_LOCATION_BY_ID='/api/v1/company_location/delete/';
export const GET_LOCATION_NAME='/api/v1/company_location/view/names/multiple';
export const UPDATE_LOCATION_STATUS_BY_ID='/api/v1/company_location/update/status/';
export const GET_LOCATION_BY_COMPANY_ID='/api/v1/company_location/view/company/multiple/';
export const UPDATE_COMPANY_LOCATION_APPROVAL_STATUS_BY_ID = '/api/v1/company_location/update/approval_status/';

// Module
export const GET_ALL_MODULE='/api/v1/module/view/multiple';
export const CREATE_MODELE='/api/v1/module/create';
export const UPDATE_MODULE_STATUS_BY_ID='/api/v1/module/update/status/';
export const UPDATE_MODULE_BY_ID='/api/v1/module/update/';
export const DELETE_MODULE_BY_ID='/api/v1/module/delete/';
export const VIEW_MODULE_NAME='/api/v1/module/view/names/multiple';
export const VIEW_LOCATION_TO_MODULE_ID='/api/v1/location_to_module/view/location/multiple/';
export const UPDATE_MODULE_APPROVAL_STATUS_BY_ID = '/api/v1/module/update/approval_status/';

// sub-module
export const GET_ALL_SUB_MODULE='/api/v1/submodule/view/multiple';
export const CREATE_SUB_MODULE='/api/v1/submodule/create';
export const UPDATE_SUB_MODULE_BY_ID='/api/v1/submodule/update/';
export const DELETE_SUB_MODULE_BY_ID='/api/v1/submodule/delete/';
export const UPDATE_SUB_MODULE_STATUS_BY_ID='/api/v1/submodule/update/status/';
export const GET_SUB_MODULE_NAME_BY_MODULE_ID='/api/v1/submodule/view/module/multiple/';
export const UPDATE_APPROVAL_STATUS_SUBMODULES_BY_ID = '/api/v1/submodule/update/approval_status/';


// service tracker
export const GET_ALL_SERVICE_TRACKER='/api/v1/service_tracker/view/multiple';
export const GET_ALL_INNER_PAGE_SERVICE_TRACKER='/api/v1/service_tracker/view';
export const GET_ALL_SERVICE_TRACKER_NAME='/api/v1/service_tracker/view/names/multiple';
export const DELETE_SERVICE_TRACKER_BY_ID='/api/v1/service_tracker/delete/';
export const CREATE_SERVICE_TRACKER ='/api/v1/service_tracker/create';
export const UPDATE_SERVICE_TRACKER ='/api/v1/service_tracker/update/';
export const UPDATE_SERVICE_TRACKER_BY_STATUS_ID ='/api/v1/service_tracker/update/status/';
export const GET_ALL_SERVICE_TRACKER_FIELDS ='/api/V1/service_tracker/view/';
export const CREATE_SERVICE_TRACKER_SPECIFICS ='/api/v1/service_tracker/create/specifics';
export const UPDATE_SERVICE_TRACKER_DATA ='api/v1/service_tracker/update/';
export const BULK_APPROVE_ALL_SERVICE_TRACKER_DATA ='/api/v1/service_tracker/update/approve/bulk/';
// export const GET_ALL_SERVICE_TRACKER_SHEET_DATA ='/api/v1/service_tracker/view';
export const GET_ALL_SERVICE_TRACKER_SHEET_DATA ='/api/v1/service_tracker/view';
export const UPDATE_SERVICE_TRACKER_APPROVAL_STATUS_BY_ID = '/api/v1/service_tracker/update/approval_status/';
export const GET_SERVICE_TRACKER_BY_SUBMODULE_ID = '/api/v1/service_tracker/view/sub_module_id/multiple/';
export const APPEND_TRACKER='api/v1/client_master/append/tracker?tracker_name=';
// Location To Module
export const GET_ALL_LOCATION_TO_MODULE='/api/v1/location_to_module/view/multiple';
export const CREATE_LOCATION_TO_MODULE='/api/v1/location_to_module/create';
export const UPDATE_LOCATION_TO_MODULE_BY_ID='/api/v1/location_to_module/update/';
export const UPDATE_LOCATION_TO_MODULE_STATUS_BY_ID='/api/v1/location_to_module/update/status/';
export const DELETE_LOCATION_TO_MODULE_BY_ID='/api/v1/location_to_module/delete/';
export const UPDATE_LOCATION_TO_MODULES_APPROVAL_STATUS_BY_ID='/api/v1/location_to_module/update/approval_status/';

// File Upload
export const AUTO_FILE_UPLOAD_PYTHON='/classify-files';
export const AUTO_FILE_UPLOAD_GOLANG='/api/v1/document_repository/create/file';
export const UPLOAD_EXCEL='/api/v1/tracker/upload_tracker/excel';
export const GET_ALL_FILES='/api/v1/document_repository/view/files';
export const DELETE_FILE_ID='/api/v1/document_repository/delete/file/';
export const UPDATE_FILE='/api/v1/document_repository/update/file/';
export const GET_DOCUMENT_DROPDOWNS_TYPES='/api/v1/document_repository/view/dropdowns/type/';
export const GET_DOCUMENT_DROPDOWNS_STAGE='/api/v1/document_repository/view/dropdowns/stage/';

// pages
export const GET_ALL_PAGE='/api/v1/pages/view/all';
// USER ACCESS LEVEL
export const GET_USER_ACCESS_LEVEL_BY_USER_ID ='/api/v1/user_access/view/user_id';
export const CREATE_USER_ACCESS_LEVEL ='/api/v1/user_access/create';
export const UPDATE_USER_ACCESS_LEVEL ='/api/v1/user_access/update/';
export const DELETE_USER_ACCESS_LEVEL ='/api/v1/user_access/delete/';
export const GET_ALL_ACCESS_TYPES ='/api/v1/user_access/view/access_types';
export const TOGGLE_USER_ACCESS_LEVEL_STATUS ='/api/v1/user_access/update/status/toggle/';
export const GET_USER_ACCESS_BY_ID ='/api/v1/user_access/view/';
export const APPROVE_USER_ACCESS = "/api/v1/user_access/update/approve/";
export const COMPANY_WISE_ACCESS='/api/v1/user_access/create/company-wise/access';
// Common API
export const APPROVE_ALL_BY_ENTITY_TYPE ='/api/v1/';

// Notification
export const GET_ALL_NOTIFICATION ='/api/v1/notification/view/multiple';
export const GET_ALL_NOTIFICATION_TEMPLATE ='/api/v1/notification/notification_template/view/multiple/';
export const GET_ALL_NOTIFICATION_TEMPLATE_BY_ID ='/api/v1/notification/notification_template/view/';
export const GET_NOTIFICATION_BY_ID ='/api/v1/notification/view/';
export const CREATE_NOTIFICATION_TEMPLATE ='/api/v1/notification/notification_template/create';
export const CREATE_NOTIFICATION ='/api/v1/notification/create';
export const UPDATE_NOTIFICATION_TEMPLATE ='/api/v1/notification/notification_template/update/';
export const UPLOAD_BULK_NOTIFICATION ='/api/v1/notification/create/bulk/upload/';
export const DELETE_NOTIFICATION_TEMPLATE_BY_ID ='/api/v1/notification/notification_template/delete/';
export const UPDATE_NOTIFICATION_TEMPLATE_APPROVAL_STATUS_BY_ID='/api/v1/notification/notification_template/update/approval_status/';
export const DELETE_NOTIFICATION_BY_ID ='/api/v1/notification/delete/';
export const UPDATE_NOTIFICATION_BY_ID ='/api/v1/notification/update/';
export const UPDATE_NOTIFICATION_APPROVAL_STATUS_BY_ID='/api/v1/notification/update/approval_status/';
export const UPDATE_NOTIFICATION_STATUS_BY_ID='/api/v1/notification/update/status/';
export const GET_INAPP_NOTIFICATION='/api/v1/in_app/view/inapp_notification_by_userID';
export const READ_INAPP_NOTIFICATION='/api/v1/in_app/update/read_inapp_notification';
export const DELETE_INAPP_NOTIFICATION='/api/v1/in_app/delete/remove_inapp_notification';
export const READ_ALL_INAPP_NOTIFICATION='/api/v1/in_app/update/read_all_inapp_notification';
export const DELETE_ALL_INAPP_NOTIFICATION='/api/v1/in_app/delete/remove_all_inapp_notification';

// Change Password
export const CHANGE_PASSWORD_AFTER_LOGIN='/api/v1/password/update/password/';
export const CHANGE_TEMPORARY_PASSWORD_STATUS='/api/v1/view/temporary_password_status/';

// forget password
export const FORGET_PASSWORD='/api/v1/password/update/email_request';
// Dashboard

export const GET_GENERAL_COMPLIANCE_PORTFOLIO='/api/v1/dashboard/view/general/compliance/portfolio'
export const GET_GENERAL_COMPLIANCE_BY_COMPANY='/api/v1/dashboard/view/general/compliance/'
export const GET_COMPLIANCE_COCKPIT_BY_COMPANY ='/api/v1/dashboard/view/compliance/cockpit/'
export const GET_COCKPIT_COMPLIANCE_PORTFOLIO ='/api/v1/dashboard/view/compliance/cockpit/portfolio'
export const GET_CLIENT_ONBOARDING_PORTFOLIO ='api/v1/dashboard/view/client/onboarding/portfolio'
export const GET_CLIENT_ONBOARDING_BY_COMPANY ='/api/v1/dashboard/view/client/onboarding/'
// Payroll dashboard
export const GET_INVESTMENT_DECLARATION_STATUS_BY_COMPANY ='/api/v1/dashboard/view/payroll/investment/declaration/status/'
export const GET_DISTRIBUTION_OF_EMPLOYEE_ACROSS_MULTIPLE_ENTITIES_OR_LOCATIONS='/api/v1/dashboard/view/payroll/multiple/entities/locations'
export const GET_TYPE_OF_SYSTEMS_USED_BY_EMPLOYER ='/api/v1/dashboard/view/payroll/system/used/employer'
export const GET_TOTAL_EMPLOYEE_COUNT ='/api/v1/dashboard/view/payroll/total/employee/count'
export const GET_PAYROLLS_CLOSED_ON_OR_AHEAD_OF_SLA_PERCENTAGE ='/api/v1/dashboard/view/payroll/closed/ahead/sla/percent'
export const GET_AVERAGE_DELAY_BETWEEN_DATA_REQUEST_DATE_AND_CLIENT_DATA_RECEIVED_DATE ='/api/v1/dashboard/view/payroll/calculate/average/delay'
export const GET_EXPLANATION_OF_EMPLOYEE_COUNT ='/api/v1/dashboard/view/payroll/explanation/employee/count'

// Helpdesk and Escalations
export const GET_TOTAL_COUNT_OF_COMMUNICATION_TYPES ='/api/v1/dashboard/view/helpdesk/communication/type'
export const GET_HELPDESK_TICKETS_RAISED_BY_COMPANY ='/api/v1/dashboard/view/helpdesk/tickets/raised'
export const GET_HELPDESK_STATUS_BASED_ON_ISSUE_SUB_TYPE ='/api/v1/dashboard/view/helpdesk/status'
export const GET_TICKETS_DISTRIBUTION_ASSIGNED_TO_COUNT ='/api/v1/dashboard/view/helpdesk/tickets/distribution'
export const GET_CASES_PENDING_FOR_SELECTED_ISSUE_SUBTYPES ='/api/v1/dashboard/view/helpdesk/pending/issue/types'
export const GET_TOTAL_DELAY_FLAGS_BY_CLIENT_AND_GOVT ='/api/v1/dashboard/view/helpdesk/client/delay/flag'
export const GET_TOTAL_DELAY_FLAGS_BY_GOVT ='/api/v1/dashboard/view/helpdesk/govt/delay/flag'

// Returns and Submissions
export const GET_RETURN_APPLICABILITY_BY_COMPANY_COMMON_NAME ='/api/v1/dashboard/view/returns/applicability/company'
export const GET_STATE_WISE_ANALYSIS_OF_APPLICABLE_RETURNS ='/api/v1/dashboard/view/returns/state/applicable'
export const GET_FREQUENCY_WISE_RETURNS ='/api/v1/dashboard/view/returns/frequency/distribution/returns'
export const GET_COMPANIES_PER_RETURNS_NAMES ='/api/v1/dashboard/view/returns/company/per/returns'
export const GET_COMPLIANCE_RISK_DITRIBUTION_BY_STATE ='/api/v1/dashboard/view/returns/compliance/risk/ditribution/state'
export const GET_COMPLIANCE_STATUS_BASED_ON_RETURNS ='/api/v1/dashboard/view/returns/compliance/status/based/returns'
export const GET_REMARKS_BASED_ON_COMPANY ='/api/v1/dashboard/view/returns/remarks/based/company'

// Audit & Visits
export const GET_AUDIT_BY_SERVICE_TYPE ='/api/v1/dashboard/view/audit/service/type'
export const GET_AUDIT_PLATFORMS_COUNT_BY_STATE_SEGMENTED ='/api/v1/dashboard/view/audit/platforms/count'
export const GET_AUDIT_MEETING_SLA_BY_RESPONSIBLE_TEAM ='/api/v1/dashboard/view/audit/sla_met/responsible/team'
export const GET_CHECKLIST_APPROVAL_BY_COMPANY_NAME ='/api/v1/dashboard/view/audit/checklist/approval/company/name'
export const GET_ESCALATION_TRIGGERED_RATE_BY_STATE ='/api/v1/dashboard/view/audit/escalation/triggered/state_wise'
export const GET_RISK_LEVEL_BASED_ON_SERVICE_TYPE ='/api/v1/dashboard/view/audit/risk/based/service_type'
export const GET_COUNT_OF_AUDIT_STATUS ='/api/v1/dashboard/view/audit/count/status'
export const GET_COUNT_OF_RISK_LEVEL ='/api/v1/dashboard/view/audit/count/risk/level'


// Notice & Inspections (need to change form postnman this is auto generated)
export const GET_AUTHORITY_DISTRIBUTION_COUNT ='/api/v1/dashboard/view/notice/inspection/authority/distribution/count'
export const GET_STATE_WISE_NOTICE_COUNT ='/api/v1/dashboard/view/notice/inspection/state/wise/notice/count'
export const GET_TYPES_OF_NOTICE_OR_INSPECTION ='/api/v1/dashboard/view/notice/inspection/type/notices'
export const GET_ANALYSIS_OF_APPLICABLE_ACT ='/api/v1/dashboard/view/notice/inspection/analysis/applicable/act'
export const GET_NOTICES_ASSIGNED_TO ='/api/v1/dashboard/view/notice/inspection/assigned/to'
export const GET_COUNT_OF_ACKNOWLEDGMENT_RATES ='/api/v1/dashboard/view/notice/inspection/acknowledged/by'
export const GET_COUNT_OF_CLIENT_DOC_SUBMISSION ='/api/v1/dashboard/view/notice/inspection/document/submission/client'
export const GET_DISTRIBUTION_OF_RESPONSE_STATUS ='/api/v1/dashboard/view/notice/inspection/response/status/count'

// General Dashboard
export const GET_STATUS_COUNT_OF_OPEN_VS_CLOSED_CASES ='/api/v1/dashboard/view/general/helpdesk/assigned/status/count';
export const GET_ASSIGNED_INDIVIDUALS_LIST ='/api/v1/dashboard/view/general/helpdesk/assigned/count';
export const GET_DOCUMENTS_PENDING_FROM ='/api/v1/dashboard/view/general/helpdesk/documents/pending/from';
export const GET_ISSUE_CATEGORY_BY_STATUS ='/api/v1/dashboard/view/general/helpdesk/status/based/issue/category';

// Dashboard Widget Mappings
export const GET_ALL_WIDGET_MAPPINGS ='/api/v1/widget-mapping/get/multiple';
export const CREATE_OR_UPDATE_WIDGET_MAPPING ='/api/v1/widget-mapping/create';
export const DELETE_WIDGET_MAPPING_BY_ID ='/api/v1/widget-mapping/delete?user_id=';
export const GET_WIDGETS_BY_USER_ID ='/api/v1/widget-mapping/get?user_id=';

// Register Processing
export const GET_ALL_REGISTER_NAMES='/api/v1/register_processing/view/register/names/multiple';
export const GET_REGISTER_MAPPING='/api/v1/register_processing/view/mapping/get?register_id=';
export const PROCESS_REGISTERS='/api/v1/register_processing/create/register';





