import { useProducts } from "../../hooks/useProducts";
import { useDebugScreen } from "../../hooks/useDebugScreen";
import { MenuContent } from "../../components/MenuContent";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ImageBanner } from "../../components/Banner";

export function OnlineStore() {
  useDebugScreen();
  const productData = useProducts("store");

  return (
    <>
      <ImageBanner />
      <Header />
      <MenuContent {...productData} title="Loja Online 🛍️" />
      <Footer />
    </>
  );
}
