import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginContainer } from "./children/auth/login/pages/Login.container";
import { HomePage } from "./children/cabinet/home/Home.page";
import { CabinetLayout } from "./children/cabinet/Cabinet.layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth">
          <Route path="login" element={<LoginContainer />} />
        </Route>
        <Route path="cabinet" element={<CabinetLayout />}>
          <Route path="home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
