import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import type { Produto } from "../../types/Produto";
import { formatCurrency } from "../../utils/formatters";
import { toggleProductLike } from "../../services/api";
import { StarIcon } from "../../assets/icons/StarIcon";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { ProductDetailsModal } from "../ProductDetailsModal";

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
  const navigate = useNavigate();
  //INICIALIZAÇÃO INTELIGENTE
  const [hasLiked, setHasLiked] = useState(() => {
    if (isAdmin) return false; //Admin não precisa disso
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(data.id);
  });

  const [likesCount, setLikesCount] = useState(data.curtidas);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div 
        className={styles.imageContainer} 
        onClick={() => {
          if (!isAdmin && data.is_loja) {
            navigate(`/loja/produto/${data.id}`);
          } else {
            setIsModalOpen(true);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src={fullImageUrl}
          alt={data.nome}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400?text=Sem+Foto";
          }}
        />
        {!data.visivel && isAdmin && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10, borderRadius: "12px" }}>
            <span style={{ backgroundColor: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: "4px", fontWeight: "bold", fontSize: "1.1rem" }}>OCULTO</span>
          </div>
        )}
        {!isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
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
        <h3 
          className={styles.title} 
          onClick={() => {
            if (!isAdmin && data.is_loja) {
              navigate(`/loja/produto/${data.id}`);
            } else {
              setIsModalOpen(true);
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {data.nome}
        </h3>
        <p className={styles.description}>{data.descricao}</p>

        <div className={styles.footer}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.preco_original && (
              <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85rem' }}>
                {formatCurrency(data.preco_original)}
              </span>
            )}
            <span className={styles.price}>{precoFormatado}</span>
          </div>

          {/* CONDICIONAL MÁGICA AQUI 👇 */}
          {isAdmin ? (
            //--- MODO ADMIN ---
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(data);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(data.id);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(data);
                }}
                className={styles.addToCartBtn}
                title="Adicionar ao Carrinho"
              >
                <ShoppingCart className={styles.cartIcon} /> <span className={styles.addToCartText}>Adicionar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsModal 
        produto={data} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </article>
  );
}
