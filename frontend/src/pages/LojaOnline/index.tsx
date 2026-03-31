import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Banner } from "../../components/Banner";

export function LojaOnline() {
  useDebugTela();
  const dadosProdutos = useProdutos("store");

  return (
    <>
      <Banner pagina="loja" />
      <Header />
      <MenuContent {...dadosProdutos} title="Loja Online 🛍️" />
      <Footer />
    </>
  );
}
