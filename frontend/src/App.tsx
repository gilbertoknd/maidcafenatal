import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuPage } from "./pages/Menu";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { LojaOnline } from "./pages/LojaOnline";
import { Mangas } from "./pages/Mangas";
import { ProdutoDetalhesLoja } from "./pages/ProdutoDetalhesLoja";
import { EventosPage } from "./pages/Eventos";
import { EventoDetalhes } from "./pages/EventoDetalhes";
import { MaidDetalhes } from "./pages/MaidDetalhes";
import { CuponsPage } from "./pages/Cupons";
import { ParceirosPage } from "./pages/Parceiros";
import { AgendarPage } from "./pages/Agendar";
import "./App.css";

import { ScrollToTop } from "./components/ScrollToTop";
import { CartButton } from "./components/CartButton";
import { CartModal } from "./components/CartModal";
import { useConfiguracoesGlobais } from "./hooks/useConfiguracoes";

function App() {
  useConfiguracoesGlobais();

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
        <Route path="/mangas" element={<Mangas />} />
        <Route path="/loja/produto/:id" element={<ProdutoDetalhesLoja />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/eventos/:id" element={<EventoDetalhes />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/maids/:id" element={<MaidDetalhes />} />
        <Route path="/cupons" element={<CuponsPage />} />
        <Route path="/parceiros" element={<ParceirosPage />} />
        <Route path="/agendar" element={<AgendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
