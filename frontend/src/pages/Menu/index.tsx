import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Banner } from "../../components/Banner";

export function MenuPage() {
  useDebugTela();
  const productData = useProdutos();

  return (
    <>
      <Banner pagina="cardapio" />
      <Header />
      <MenuContent {...productData} />
      <Footer />
    </>
  );
}
