import { X, ShoppingCart } from "lucide-react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";
import type { Produto } from "../../types/Produto";
import { formatCurrency } from "../../utils/formatters";
import { useCart } from "../../hooks/useCart";

interface ProductDetailsModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ produto, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${produto.imagem_url}`;
  const precoFormatado = formatCurrency(produto.preco);

  // Parse tags string into array, return empty if null/undefined
  const tagsArray = produto.tags 
    ? produto.tags.split(",").map((tag) => tag.trim()).filter(t => t.length > 0)
    : [];

  return createPortal(
    <div 
      className={styles.modalOverlay} 
      onClick={(e) => {
        e.stopPropagation(); // Impede que o clique no overlay suba para o card
        onClose();
      }}
    >
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar no meio do modal E impede de subir pro card
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className={styles.imageContainer}>
          <img
            src={fullImageUrl}
            alt={produto.nome}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=Sem+Foto";
            }}
          />
        </div>

        <div className={styles.infoContainer}>
          <h2 className={styles.title}>{produto.nome}</h2>
          
          <span className={styles.price}>{precoFormatado}</span>

          {tagsArray.length > 0 && (
            <div className={styles.tagsContainer}>
              {tagsArray.map((tag, idx) => (
                <span key={idx} className={styles.tagBadge} data-tag={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className={styles.description}>
            {produto.descricao || "Sem descrição disponível para este produto."}
          </p>

          <button
            className={styles.addToCartBtn}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(produto);
              onClose(); // Optional: you can close the modal after adding, or keep it open.
            }}
          >
            <ShoppingCart size={20} />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
