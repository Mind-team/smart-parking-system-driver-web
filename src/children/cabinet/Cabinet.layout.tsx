import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, NavbarElement } from "sps-ui";
import classes from "./Cabinet.styles.module.css";

export const CabinetLayout = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Navbar>
        <NavbarElement
          onClick={() => navigate("/cabinet/home")}
          title="Главная"
        />
        <NavbarElement
          onClick={() => navigate("/cabinet/history")}
          title="История"
        />
        <NavbarElement onClick={() => navigate("")} title="Паркинги" />
        <NavbarElement
          onClick={() => navigate("/cabinet/profile")}
          title="Профиль"
        />
      </Navbar>
      <Outlet />
    </div>
  );
};
