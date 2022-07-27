import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";

const Index = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" name="home" element={<Home/>} />
          <Route exact path="/signup" name="signup" element={<Signup/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default Index;
