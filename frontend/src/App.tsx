import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuPage } from "./pages/Menu";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { OnlineStore } from "./pages/OnlineStore";
import "./App.css";

import { ScrollToTop } from "./components/ScrollToTop";
import { CartButton } from "./components/CartButton";
import { CartModal } from "./components/CartModal";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartButton />
      <CartModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/loja" element={<OnlineStore />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
