import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, NavbarElement } from "sps-ui";

export const CabinetLayout = () => {
  return (
    <div>
      <Navbar>
        <NavbarElement title="Главная" />
        <NavbarElement title="История" />
        <NavbarElement title="Паркинги" />
        <NavbarElement title="Профиль" />
      </Navbar>
      <Outlet />
    </div>
  );
};
