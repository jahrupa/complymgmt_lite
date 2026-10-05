// export const flattenObject = (obj, parent = "") => {
//   let result = {};
 
//   Object.keys(obj).forEach((key) => {
//     const newKey = parent ? `${parent}.${key}` : key;
 
//     if (
//       typeof obj[key] === "object" &&
//       obj[key] !== null &&
//       !Array.isArray(obj[key])
//     ) {
//       Object.assign(result, flattenObject(obj[key], newKey));
//     } else {
//       result[newKey] = obj[key];
//     }
//   });
 
//   return result;
// };

export const flattenObject = (obj, parent = "") => {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  let result = {};

  Object.keys(obj).forEach((key) => {
    const newKey = parent ? `${parent}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(result, flattenObject(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
};