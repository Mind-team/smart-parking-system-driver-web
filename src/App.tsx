import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginContainer } from "./children/auth/login/pages/Login.container";
import { HomePage } from "./children/cabinet/home/Home.page";
import { HistoryPage } from "./children/cabinet/history/History.page";
import { CabinetLayout } from "./children/cabinet/Cabinet.layout";
import { ParkingProcessDetails } from "./children/cabinet/history/components/ParkingProcessDetails/ParkingProcessDetails.component";
import { ProfilePage } from "./children/cabinet/profile/Profile.page";
import { AuthGuard } from "./guards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth">
          <Route path="login" element={<LoginContainer />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route path="cabinet" element={<CabinetLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:id" element={<ParkingProcessDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
