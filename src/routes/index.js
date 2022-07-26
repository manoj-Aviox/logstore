import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

const Index = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" name="home" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default Index;
