import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export function LojaOnline() {
  useDebugTela();
  const dadosProdutos = useProdutos("store");

  return (
    <>
      <Header />
      <MenuContent {...dadosProdutos} title="Loja Online 🛍️" emptyMessage="nenhum item encontrado :(" />
      <Footer />
    </>
  );
}
