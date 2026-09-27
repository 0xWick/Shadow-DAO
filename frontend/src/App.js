import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Proposal from "./pages/Proposal";

import Navigation from "./Navigation";
import Home from "./pages/Home";
import QR from "./pages/QrVerification";
import Owner from "./pages/owner";



const App = () => {

  return (
    <>

      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/qr" element={<QR />} />
        <Route path="/owner" element={<Owner />} />
      </Routes>
    </>
  );
};

export default App;