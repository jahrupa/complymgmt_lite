import { decryptData } from "./encrypt";

export const getDecryptedItem = (key) => {
    const encryptedValue = localStorage.getItem(key);
    return encryptedValue ? decryptData(encryptedValue) : null;
};
