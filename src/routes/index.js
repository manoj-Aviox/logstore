import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Index = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            name="home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/signup"
            name="signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default Index;
