import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const clearLocationState = () =>
  window.history.replaceState({}, document.title);

export const useLocationState = <T>(
  clearStorageAfterUnmount = true,
): [T, () => void] => {
  if (clearStorageAfterUnmount) {
    useEffect(() => {
      return () => {
        clearLocationState();
        console.log("Cleared location state");
      };
    });
  }

  return [
    useLocation().state as T,
    () => window.history.replaceState({}, document.title),
  ];
};
