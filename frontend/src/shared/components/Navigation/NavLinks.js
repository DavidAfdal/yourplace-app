import React from "react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutHandler = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" end>
          All User
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="places/new"> Add Places</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="auth"> Authennticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
