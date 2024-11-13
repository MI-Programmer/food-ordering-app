import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />
      <Route path="auth-callback" element={<AuthCallbackPage />} />
      <Route
        path="search/:city"
        element={
          <Layout>
            <SearchPage />
          </Layout>
        }
      />

      <Route
        element={
          <Layout>
            <ProtectedRoute />
          </Layout>
        }
      >
        <Route path="user-profile" element={<UserProfilePage />} />
        <Route path="manage-restaurant" element={<ManageRestaurantPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
