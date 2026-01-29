import { useState } from "react";
import styles from "./styles.module.css";
import type { Produto } from "../../types/produto";
import { formatCurrency } from "../../utils/formatters";
import { toggleProductLike } from "../../services/api";
import { StarIcon } from "../../assets/icons/StarIcon";

// interface ProductCardProps {
//   data: Produto;
// }

// //Chave para salvar no navegador
// const STORAGE_KEY = "mewmew_liked_products";

// export function ProductCard({ data }: ProductCardProps) {
//   //INICIALIZAÇÃO INTELIGENTE
//   const [hasLiked, setHasLiked] = useState(() => {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     const likedArray: number[] = stored ? JSON.parse(stored) : [];
//     return likedArray.includes(data.id);
//   });

//   const [likesCount, setLikesCount] = useState(data.curtidas);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const fullImageUrl = `${backendUrl}${data.imagem_url}`;

//   const precoFormatado = formatCurrency(data.preco);

//   async function handleLike() {
//     const action = hasLiked ? "unlike" : "like";

//     //Optimistic UI (Muda a tela antes)
//     setHasLiked(!hasLiked);
//     setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

//     try {
//       //Chama a API para o fetch
//       const novasCurtidas = await toggleProductLike(data.id, action);

//       //Salva no LocalStorage o valor correto
//       setLikesCount(novasCurtidas);

//       //Lógica do LocalStorage
//       const stored = localStorage.getItem(STORAGE_KEY);
//       let likedArray: number[] = stored ? JSON.parse(stored) : [];

//       if (action === "like") {
//         if (!likedArray.includes(data.id)) likedArray.push(data.id);
//       } else {
//         likedArray = likedArray.filter((id) => id !== data.id);
//       }
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(likedArray));
//     } catch (error) {
//       console.error("Erro:", error);
//       //Rollback (Desfaz a mudança visual)
//       setHasLiked(!hasLiked);
//       setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
//     }
//   }

//   return (
//     <article className={styles.card}>
//       <div className={styles.imageContainer}>
//         <img
//           src={fullImageUrl}
//           alt={data.nome}
//           className={styles.image}
//           onError={(e) => {
//             e.currentTarget.src = "https://placehold.co/400?text=Sem+Foto";
//           }}
//         />
//       </div>

//       <div className={styles.content}>
//         <h3 className={styles.title}>{data.nome}</h3>
//         <p className={styles.description}>{data.descricao}</p>

//         <div className={styles.footer}>
//           <span className={styles.price}>{precoFormatado}</span>

//           <button
//             onClick={handleLike}
//             className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
//             title={hasLiked ? "Descurtir" : "Curtir"}
//             style={{ display: "flex", alignItems: "center", gap: "5px" }}
//           >
//             <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
//               {likesCount}
//             </span>

//             <StarIcon
//               width="24"
//               height="24"
//               fill={hasLiked ? "currentColor" : "none"}
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

import { Edit, Trash2 } from "lucide-react"; //Importe os ícones que você usa no Admin

interface ProductCardProps {
  data: Produto;
  //Propriedades Opcionais (?) para o modo Admin
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: number) => void;
}

//Chave para salvar no navegador
const STORAGE_KEY = "mewmew_liked_products";

export function ProductCard({ data, onEdit, onDelete }: ProductCardProps) {
  //Verifica se estamos no modo Admin (se as funções foram passadas)
  const isAdmin = !!onEdit && !!onDelete;

  //INICIALIZAÇÃO INTELIGENTE (Só roda se NÃO for admin para economizar processamento)
  const [hasLiked, setHasLiked] = useState(() => {
    if (isAdmin) return false; // Admin não precisa disso
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(data.id);
  });

  const [likesCount, setLikesCount] = useState(data.curtidas);

  //Fallback seguro para a URL (caso o .env esteja vazio em algum ambiente)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${data.imagem_url}`;

  const precoFormatado = formatCurrency(data.preco);

  async function handleLike() {
    if (isAdmin) return; // Segurança extra

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
      </div>

      <div className={styles.content}>
        {/* Adicionei o destaque aqui também, pois é útil ver no Admin */}
        {data.destaque && (
          <span
            style={{
              background: "#ffc107",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: "bold",
              display: "inline-block",
              marginBottom: "5px",
            }}
          >
            DESTAQUE
          </span>
        )}

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
            //--- MODO PÚBLICO (LIKE) ---
            <button
              onClick={handleLike}
              className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
              title={hasLiked ? "Descurtir" : "Curtir"}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                {likesCount}
              </span>
              <StarIcon
                width="24"
                height="24"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
