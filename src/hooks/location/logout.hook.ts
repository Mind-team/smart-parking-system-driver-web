import { StorageToken, useStorage } from "../storage";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const storage = useStorage();
  const navigate = useNavigate();
  return () => {
    storage.remove(StorageToken.AccessToken);
    storage.remove(StorageToken.RefreshToken);
    navigate("/login");
  };
};
