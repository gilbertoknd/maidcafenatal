import { useState } from "react";
import styles from "./styles.module.css";
import type { Produto } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { toggleProductLike } from "../../services/api";

interface ProductCardProps {
  data: Produto;
}

//Chave para salvar no navegador
const STORAGE_KEY = "mewmew_liked_products";

export function ProductCard({ data }: ProductCardProps) {
  //INICIALIZAÇÃO INTELIGENTE
  const [hasLiked, setHasLiked] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(data.id);
  });

  const [likesCount, setLikesCount] = useState(data.curtidas);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fullImageUrl = `${backendUrl}${data.imagem_url}`;

  const precoFormatado = formatCurrency(data.preco);

  async function handleLike() {
    const action = hasLiked ? "unlike" : "like";

    //Optimistic UI (Muda a tela antes)
    setHasLiked(!hasLiked);
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      //Chama a API para o fetch
      const novasCurtidas = await toggleProductLike(data.id, action);

      //Salva no LocalStorage o valor correto
      setLikesCount(novasCurtidas);

      //Lógica do LocalStorage
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
      //Rollback (Desfaz a mudança visual)
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
