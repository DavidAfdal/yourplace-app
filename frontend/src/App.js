import React, { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlaces from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlaces from "./places/pages/UpdatePlaces";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useEffect } from "react";
import Otp from "./users/pages/Otp";
function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState();
  // const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // let logoutTimer;

  const login = useCallback((uid, token) => {
    setToken(token);
    // const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    // setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem("userData", JSON.stringify({ userId: uid, token: token }));
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(false);
    setUserId(null);
    // setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  // useEffect(() => {
  //   if (token && tokenExpirationDate) {
  //     const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
  //     logoutTimer = setTimeout(logout, remainingTime);
  //   } else {
  //     clearTimeout(logoutTimer);
  //   }
  // }, [token, tokenExpirationDate, logout]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    console.log(storedData);
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlaces />} />
        <Route path="/places/:placeId" element={<UpdatePlaces />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp/:id" element={<Otp />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, userId: userId, login: login, logout: logout, token: token }}>
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
