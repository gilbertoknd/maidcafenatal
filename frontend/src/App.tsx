import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuPage } from "./pages/Menu";
import { Home } from "./pages/Home";
import "./App.css";

import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/cardapio" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
