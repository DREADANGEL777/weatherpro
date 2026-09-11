import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home/Home";
import { Pricing } from "./pages/Pricing/Pricing";
import { NotFound } from "./pages/NotFound/NotFound";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
