export const useStorage = () => {
  const first = (key: string) => localStorage.getItem(key);
  const second = (key: string, value: string) =>
    localStorage.setItem(key, value);

  return { read: first, write: second };
};
