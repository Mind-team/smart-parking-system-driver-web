export const useStorage = () => {
  const read = (key: string) => localStorage.getItem(key);
  const write = (key: string, value: string) =>
    localStorage.setItem(key, value);

  return { read, write };
};
