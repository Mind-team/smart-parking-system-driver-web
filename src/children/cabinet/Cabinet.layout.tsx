import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, NavbarElement } from "sps-ui";
import classes from "./Cabinet.styles.module.css";

export const CabinetLayout = () => {
  return (
    <div className={classes.wrapper}>
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
