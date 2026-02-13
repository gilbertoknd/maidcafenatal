import { useProducts } from "../../hooks/useProducts";
import { useDebugScreen } from "../../hooks/useDebugScreen";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ImageBanner } from "../../components/Banner";

export function MenuPage() {
  useDebugScreen();
  const productData = useProducts();

  return (
    <>
      <ImageBanner />
      <Header />
      <MenuContent {...productData} />
      <Footer />
    </>
  );
}
