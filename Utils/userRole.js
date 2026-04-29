export const getUserRoleLabel = (userType) => {
  switch (Number(userType)) {
    case 0:
      return "Internal";
    case 1:
      return "External";
    default:
      return "";
  }
};