import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import styles from "./styles.module.css";

export function CartButton() {
  const { cartCount, setIsCartOpen } = useCart();

  if (cartCount === 0) return null;

  return (
    <button className={styles.cartButton} onClick={() => setIsCartOpen(true)}>
      <div className={styles.iconContainer}>
        <ShoppingCart size={24} />
        <span className={styles.badge}>{cartCount}</span>
      </div>
    </button>
  );
}
