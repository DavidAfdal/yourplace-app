import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SlideDrawer from "./SlideDrawer";

import "./MainNavigation.css";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setIsDrawerOpen(true);
  };
  const closeDrawerHandler = () => {
    setIsDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {isDrawerOpen && <Backdrop onClick={closeDrawerHandler} />}

      <SlideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SlideDrawer>

      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/"> Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav ">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
