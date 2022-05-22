import { StorageToken } from "./storageToken.enum";

export const useStorage = () => {
  const read = (key: StorageToken) => localStorage.getItem(key);
  const write = (key: StorageToken, value: string) =>
    localStorage.setItem(key, value);

  return { read, write };
};
