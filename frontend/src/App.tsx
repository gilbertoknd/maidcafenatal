import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuPage } from "./pages/Menu";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { LojaOnline } from "./pages/LojaOnline";
import { ProdutoDetalhesLoja } from "./pages/ProdutoDetalhesLoja";
import { EventosPage } from "./pages/Eventos";
import { EventoDetalhes } from "./pages/EventoDetalhes";
import { MaidDetalhes } from "./pages/MaidDetalhes";
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
        <Route path="/loja" element={<LojaOnline />} />
        <Route path="/loja/produto/:id" element={<ProdutoDetalhesLoja />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/eventos/:id" element={<EventoDetalhes />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/maids/:id" element={<MaidDetalhes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
