import { useEffect, useState } from "react";
import { Instagram, ExternalLink, Sparkles } from "lucide-react";
import styles from "./styles.module.css";
import { buscarInstagramPosts } from "../../services/api";
import { INSTAGRAM_URL } from "../../utils/contato";
import type { InstagramPost } from "../../types/Instagram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Feed do Instagram na Home — mosaico com o primeiro post em destaque
 * (card 2x2), 4 posts menores e um card de redirecionamento pro perfil.
 * Os posts vêm da API (gerenciados pela aba Admin → Instagram).
 */
export function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await buscarInstagramPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao carregar posts do Instagram:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loading}>Carregando feed...</div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const [destaque, ...demais] = posts.slice(0, 5);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>
            <Instagram size={15} /> Siga a magia
          </span>
          <h2 className={styles.title}>Mew Mew no Instagram ♡</h2>
          <p className={styles.subtitle}>
            Acompanhe nosso dia a dia, novidades e momentos mágicos no
            @mewmewnatal
          </p>
        </header>

        <div className={styles.grid}>
          {/* Post em destaque — ocupa 2x2 no mosaico */}
          <a
            href={destaque.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.postCard} ${styles.featuredCard}`}
            data-testid="instagram-destaque"
          >
            <div className={styles.imageWrapper}>
              <img
                src={`${BACKEND_URL}${destaque.imagem_url}`}
                alt="Post em destaque do Instagram do Mew Mew Café"
                className={styles.image}
                loading="lazy"
              />
              <span className={styles.featuredBadge}>
                <Sparkles size={13} /> Destaque
              </span>
              <div className={styles.overlay}>
                <ExternalLink size={24} />
                <span>Ver no Instagram</span>
              </div>
            </div>
          </a>

          {demais.map((post) => (
            <a
              key={post.id}
              href={post.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.postCard}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={`${BACKEND_URL}${post.imagem_url}`}
                  alt="Post do Instagram do Mew Mew Café"
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <ExternalLink size={22} />
                  <span>Ver no Instagram</span>
                </div>
              </div>
            </a>
          ))}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.postCard} ${styles.redirectCard}`}
          >
            <Instagram size={42} />
            <h3 className={styles.redirectText}>Seguir</h3>
            <span className={styles.redirectHandle}>@mewmewnatal</span>
          </a>
        </div>
      </div>
    </section>
  );
}
