import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareerPlanner from "./components/CareerPlanner";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CareerPlanner />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
