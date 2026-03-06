import { useState } from "react";
import styles from "./styles.module.css";
import type { Produto } from "../../types/Produto";
import { formatCurrency } from "../../utils/formatters";
import { toggleProductLike } from "../../services/api";
import { StarIcon } from "../../assets/icons/StarIcon";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";

interface ProductCardProps {
  data: Produto;
  isAdmin?: boolean;
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: number) => void;
}

//Chave para salvar no navegador
const STORAGE_KEY = "mewmew_liked_products";

export function ProductCard({
  data,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const { addToCart } = useCart();
  //INICIALIZAÇÃO INTELIGENTE
  const [hasLiked, setHasLiked] = useState(() => {
    if (isAdmin) return false; //Admin não precisa disso
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(data.id);
  });

  const [likesCount, setLikesCount] = useState(data.curtidas);

  //Fallback para a URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${data.imagem_url}`;

  const precoFormatado = formatCurrency(data.preco);

  async function handleLike() {
    if (isAdmin) return; //Segurança extra

    const action = hasLiked ? "unlike" : "like";

    //Optimistic UI
    setHasLiked(!hasLiked);
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      const novasCurtidas = await toggleProductLike(data.id, action);
      setLikesCount(novasCurtidas);

      const stored = localStorage.getItem(STORAGE_KEY);
      let likedArray: number[] = stored ? JSON.parse(stored) : [];

      if (action === "like") {
        if (!likedArray.includes(data.id)) likedArray.push(data.id);
      } else {
        likedArray = likedArray.filter((id) => id !== data.id);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedArray));
    } catch (error) {
      console.error("Erro:", error);
      //Rollback
      setHasLiked(!hasLiked);
      setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={fullImageUrl}
          alt={data.nome}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400?text=Sem+Foto";
          }}
        />
        {!isAdmin && (
          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
            title={hasLiked ? "Descurtir" : "Curtir"}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
              {likesCount}
            </span>
            <StarIcon
              width="20"
              height="20"
              fill={hasLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </button>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{data.nome}</h3>
        <p className={styles.description}>{data.descricao}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{precoFormatado}</span>

          {/* CONDICIONAL MÁGICA AQUI 👇 */}
          {isAdmin ? (
            //--- MODO ADMIN ---
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onEdit && onEdit(data)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "6px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Editar"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete && onDelete(data.id)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "6px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            //--- MODO PÚBLICO (ADD TO CART + LIKE) ---
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  addToCart(data);
                  alert(`${data.nome} adicionado ao carrinho!`);
                }}
                style={{
                  background: "#ffb6c1", // Pinkish maid cafe color
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "bold",
                  flex: 1,
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                title="Adicionar ao Carrinho"
              >
                <ShoppingCart size={18} /> <span className={styles.addToCartText}>Adicionar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
