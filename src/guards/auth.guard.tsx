import React from "react";
import { StorageToken, useStorage } from "../hooks/storage";
import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = () => {
  const storage = useStorage();
  const isAuth =
    storage.read(StorageToken.AccessToken) &&
    storage.read(StorageToken.RefreshToken);

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
