import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Banner } from "../../components/Banner";

export function Mangas() {
  useDebugTela();
  const dadosProdutos = useProdutos("mangas");

  return (
    <>
      <Banner pagina="loja" /> {/* Reutilizando o banner da loja ou criando um especifico no admin */}
      <Header />
      <MenuContent {...dadosProdutos} title="Mangás 📚" emptyMessage="Nenhum mangá encontrado :(" />
      <Footer />
    </>
  );
}
