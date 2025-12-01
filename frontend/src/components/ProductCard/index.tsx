import { useState } from "react";
import styles from "./styles.module.css";
import type { Produto } from "../../types";

interface ProductCardProps {
  data: Produto;
}

// Chave para salvar no navegador
const STORAGE_KEY = "mewmew_liked_products";

export function ProductCard({ data }: ProductCardProps) {
  // 1. INICIALIZAÇÃO INTELIGENTE
  const [hasLiked, setHasLiked] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(data.id);
  });

  const [likesCount, setLikesCount] = useState(data.curtidas);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fullImageUrl = `${backendUrl}${data.imagem_url}`;

  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(data.preco));

  async function handleLike() {
    // 1. Define qual ação tomar baseada no estado atual
    // Se já deu like, a ação agora é 'unlike'. Se não, é 'like'.
    const action = hasLiked ? "unlike" : "like";

    // 2. Optimistic UI: Atualiza a tela ANTES do servidor responder
    // Isso faz o clique parecer instantâneo
    setHasLiked(!hasLiked);
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      // Chama a rota dinâmica (/like ou /unlike)
      const res = await fetch(
        `${backendUrl}/api/produtos/${data.id}/${action}`,
        {
          method: "PATCH",
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        // Confirma o valor real vindo do banco (para garantir sincronia)
        setLikesCount(responseData.novas_curtidas);

        // 3. Atualiza o LocalStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        let likedArray: number[] = stored ? JSON.parse(stored) : [];

        if (action === "like") {
          // Adiciona o ID se não existir
          if (!likedArray.includes(data.id)) likedArray.push(data.id);
        } else {
          // Remove o ID (Filtra a lista)
          likedArray = likedArray.filter((id) => id !== data.id);
        }

        // Salva a lista atualizada
        localStorage.setItem(STORAGE_KEY, JSON.stringify(likedArray));
      } else {
        // Se o servidor der erro, desfaz a mudança visual (Rollback)
        setHasLiked(!hasLiked);
        setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
        console.error("Erro no servidor:", responseData);
      }
    } catch (error) {
      console.error("Erro de rede ao dar like:", error);
      // Rollback em caso de erro de rede
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
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{data.nome}</h3>
        <p className={styles.description}>{data.descricao}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{precoFormatado}</span>

          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
            // REMOVIDO: disabled={hasLiked} -> Agora pode clicar sempre
            title={hasLiked ? "Descurtir" : "Curtir"}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {likesCount}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={hasLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
