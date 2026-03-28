import { ShoppingCart } from "lucide-react";
import { useCarrinho } from "../../hooks/useCarrinho";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export function CartButton() {
  const { contagemItens, setEstaAberto } = useCarrinho();
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (contagemItens === 0) return;
    
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    
    return () => clearTimeout(timer);
  }, [contagemItens]);

  if (contagemItens === 0) return null;

  return (
    <button 
      className={`${styles.cartButton} ${isBumping ? styles.bump : ""}`} 
      onClick={() => setEstaAberto(true)}
    >
      <div className={styles.iconContainer}>
        <ShoppingCart size={24} />
        <span className={styles.badge}>{contagemItens}</span>
      </div>
    </button>
  );
}
