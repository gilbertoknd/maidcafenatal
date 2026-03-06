import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export function CartButton() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    
    return () => clearTimeout(timer);
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <button 
      className={`${styles.cartButton} ${isBumping ? styles.bump : ""}`} 
      onClick={() => setIsCartOpen(true)}
    >
      <div className={styles.iconContainer}>
        <ShoppingCart size={24} />
        <span className={styles.badge}>{cartCount}</span>
      </div>
    </button>
  );
}
