import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import type { Produto } from "../../types/Produto";
import { formatCurrency } from "../../utils/formatadores";
import { StarIcon } from "../../assets/icons/StarIcon";
import { Edit, Trash2, ShoppingCart, Eye, EyeOff } from "lucide-react";
import { useCarrinho } from "../../hooks/useCarrinho";
import { ProdutoDetalhesModal } from "../ProdutoDetalhesModal";
import { useProductLike } from "../../hooks/useProductLike";

interface ProdutoCardProps {
  produto: Produto;
  isAdmin?: boolean;
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: number) => void;
  onToggleVisibility?: (id: number) => void;
  /**
   * Variante visual do card:
   * - "default": compacto (padrão).
   * - "featured": imagem maior e sem corte, para cardápios com poucos itens.
   * - "manga": exibe a capa inteira (proporção de pôster, sem corte).
   */
  variant?: "default" | "featured" | "manga";
}

/**
 * Sub-componente para a Imagem e Overlays ( SRP: Visualização do Produto )
 */
const CardImage = ({ 
  produto, 
  isAdmin, 
  hasLiked, 
  handleLike, 
  likesExibicao,
  onClick,
  isFeatured = false
}: { 
  produto: Produto; 
  isAdmin: boolean; 
  hasLiked: boolean; 
  handleLike: () => void;
  likesExibicao: number;
  onClick: () => void;
  isFeatured?: boolean;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${produto.imagem_url}`;

  return (
    <div className={`${styles.imageContainer} ${styles.clickable}`} onClick={onClick}>
      <img
        src={fullImageUrl}
        alt={produto.nome}
        className={styles.image}
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/400?text=Sem+Foto";
        }}
      />
      
      {!produto.visivel && isAdmin && (
        <div className={styles.overlayOculto}>
          <span className={styles.badgeOculto}>OCULTO</span>
        </div>
      )}

      {!isAdmin && !isFeatured && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
          aria-label={hasLiked ? "Descurtir" : "Curtir"}
          title={hasLiked ? "Descurtir" : "Curtir"}
        >
          <span className={styles.likesCountText}>{likesExibicao}</span>
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
  );
};

/**
 * Sub-componente para as Ações de Admin ( SRP: Gestão )
 */
const CardAdminActions = ({ 
  produto, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}: { 
  produto: Produto; 
  onEdit?: (p: Produto) => void; 
  onDelete?: (id: number) => void; 
  onToggleVisibility?: (id: number) => void;
}) => (
  <div className={styles.adminActions}>
    <button
      onClick={(e) => { e.stopPropagation(); onEdit?.(produto); }}
      className={`${styles.btnAdmin} ${styles.btnEdit}`}
      title="Editar"
      aria-label={`Editar ${produto.nome}`}
    >
      <Edit size={18} />
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete?.(produto.id); }}
      className={`${styles.btnAdmin} ${styles.btnDelete}`}
      title="Excluir"
      aria-label={`Excluir ${produto.nome}`}
    >
      <Trash2 size={18} />
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(produto.id); }}
      className={`${styles.btnAdmin} ${produto.visivel ? styles.btnVisibility : styles.btnVisibilityOff}`}
      title={produto.visivel ? "Ocultar" : "Mostrar"}
      aria-label={produto.visivel ? `Ocultar ${produto.nome}` : `Mostrar ${produto.nome}`}
    >
      {produto.visivel ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
);

/**
 * Sub-componente para as Ações de Público ( SRP: Consumo )
 */
const CardPublicActions = ({ 
  produto, 
  onAdd 
}: { 
  produto: Produto; 
  onAdd: (p: Produto) => void 
}) => (
  <button
    onClick={(e) => { e.stopPropagation(); onAdd(produto); }}
    className={styles.addToCartBtn}
    title="Adicionar ao Carrinho"
    aria-label={`Adicionar ${produto.nome} ao carrinho`}
  >
    <ShoppingCart className={styles.cartIcon} /> 
    <span className={styles.addToCartText}>Adicionar</span>
  </button>
);

/**
 * COMPONENTE PRINCIPAL (Orquestrador)
 */
export function ProdutoCard({
  produto,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleVisibility,
  variant = "default",
}: ProdutoCardProps) {
  const { adicionarProduto } = useCarrinho();
  const navigate = useNavigate();
  const { hasLiked, handleLike } = useProductLike(produto.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesContagem, setLikesContagem] = useState(produto.curtidas);

  // Sincroniza com a prop caso o cache global mude (ex: vindo do servidor)
  useEffect(() => {
    setLikesContagem(produto.curtidas);
  }, [produto.curtidas]);

  const handleLikeClick = async () => {
    // UI Otimista Local
    const novoValor = hasLiked ? likesContagem - 1 : likesContagem + 1;
    setLikesContagem(novoValor);

    try {
      await handleLike();
    } catch (err) {
      // O rollback global do TanStack Query cuidará da prop produto futuramente,
      // mas precisamos reverter o estado local imediatamente se houver erro direto.
      setLikesContagem(produto.curtidas);
    }
  };

  const handleOpenDetails = () => {
    if (!isAdmin && produto.is_loja) {
      navigate(`/loja/produto/${produto.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const variantClass =
    variant === "featured"
      ? styles.featured
      : variant === "manga"
        ? styles.manga
        : "";

  return (
    <article className={`${styles.card} ${variantClass}`}>
      {variant === "featured" && (
        <div className={styles.featuredHeader} onClick={handleOpenDetails}>
          <h3 className={`${styles.title} ${styles.clickable}`}>
            {produto.nome}
          </h3>
          <div className={styles.dottedDivider}>•••••</div>
        </div>
      )}

      <CardImage
        produto={produto} 
        isAdmin={isAdmin} 
        hasLiked={hasLiked} 
        handleLike={handleLikeClick} 
        likesExibicao={likesContagem}
        onClick={handleOpenDetails}
        isFeatured={variant === "featured"}
      />

      <div className={styles.content}>
        {variant !== "featured" && (
          <h3 className={`${styles.title} ${styles.clickable}`} onClick={handleOpenDetails}>
            {produto.nome}
          </h3>
        )}
        
        {variant !== "featured" && <p className={styles.description}>{produto.descricao}</p>}

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            {produto.preco_original && (
              <span className={styles.originalPrice}>
                {formatCurrency(produto.preco_original)}
              </span>
            )}
            <span className={styles.price}>{formatCurrency(produto.preco)}</span>
          </div>

          {isAdmin ? (
            <CardAdminActions 
              produto={produto} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onToggleVisibility={onToggleVisibility} 
            />
          ) : (
            variant !== "featured" && (
              <CardPublicActions 
                produto={produto} 
                onAdd={adicionarProduto} 
              />
            )
          )}
        </div>
      </div>

      <ProdutoDetalhesModal 
        produto={produto} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        hasLiked={hasLiked}
        onLike={handleLikeClick}
        likesCount={likesContagem}
      />
    </article>
  );
}
