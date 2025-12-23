import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-quill-new/dist/quill.snow.css";
import "./assets/css/quillStyles.css";

import Layout from "./layout/Layout";
import { ContentCreate, Main, Dashboard, Settings, Schedule } from "./pages";
import MyPost from "./pages/main/MyPost";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Subscription from "./pages/subscription/Subscription";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            index
            element={<Navigate to="/content-generation" replace />}
          />
          {/* <Route
            path="/subscription"
            element={<Subscription/>}
          /> */}
          <Route
            path="content-generation"
            element={
              <ProtectedRoute>
                <ContentCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="content-personalization"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="Schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-post"
            element={
              <ProtectedRoute>
                <MyPost />
              </ProtectedRoute>
            }
          />
          <Route path="logout" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
