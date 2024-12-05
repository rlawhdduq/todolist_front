import CryptoJS from "crypto-js";

const SECRET_KEY = "ag1as89dd27QXC*&$#du1!@35";

export const enc = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export const dec = (encryptedData: string): string => {
    return CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}