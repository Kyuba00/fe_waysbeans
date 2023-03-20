import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// API
import { API, setAuthToken } from "./configs/api";
// contexts
import { UserContext } from "./contexts/UserContext";
// pages
import LoadingPage from "./pages/LoadingPage";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import TransactionPage from "./pages/TransactionPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminProductPage from "./pages/AdminProductPage";
import {
  PrivateRouteLogin,
  PrivateRouteAdmin,
  PrivateRouteUser,
} from "./components/privateRoutes/PrivateRoute";

export default function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/auth");
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsloading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      console.log("check user success: ", response);
      let payload = response.data.data;
      payload.token = localStorage.token;
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsloading(false);
    } catch (error) {
      console.log("check user failed: ", error);
      dispatch({
        type: "AUTH_ERROR",
      });
      setIsloading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        // <>
        //   <LoadingPage />
        // </>
        null
      ) : (
        <>
          <Header />
          <Routes>
            {/* user */}
            <Route path="/auth" element={<HomePage />} />
            <Route element={<PrivateRouteLogin />}>
              <Route element={<PrivateRouteUser />}>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/product/:id" element={<ProductPage />} />
                <Route
                  exact
                  path="/transaction"
                  element={<TransactionPage />}
                />
                <Route exact path="/profile" element={<ProfilePage />} />
              </Route>
              {/* admin */}
              <Route element={<PrivateRouteAdmin />}>
                <Route exact path="/transactions" element={<AdminPage />} />
                <Route exact path="/products" element={<AdminProductPage />} />
              </Route>
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}
