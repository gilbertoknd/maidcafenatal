import { useProdutos } from "../../hooks/useProdutos";
import { useDebugTela } from "../../hooks/useDebugTela";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export function MenuPage() {
  useDebugTela();
  const productData = useProdutos();

  return (
    <>
      <Header />
      <MenuContent {...productData} variant="featured" />
      <Footer />
    </>
  );
}
