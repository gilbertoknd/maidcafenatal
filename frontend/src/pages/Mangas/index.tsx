import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export function Mangas() {
  useDebugTela();
  const dadosProdutos = useProdutos("mangas");

  return (
    <>
      <Header />
      <MenuContent {...dadosProdutos} title="Mangás 📚" emptyMessage="Nenhum mangá encontrado :(" />
      <Footer />
    </>
  );
}
