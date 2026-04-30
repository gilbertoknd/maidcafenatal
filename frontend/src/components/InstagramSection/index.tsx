import { useEffect, useState } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import styles from "./styles.module.css";
import { buscarInstagramPosts } from "../../services/api";
import type { InstagramPost } from "../../types/Instagram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <Instagram size={32} className={styles.icon} />
            <h2 className={styles.title}>Confira nosso Instagram</h2>
          </div>
          <p className={styles.subtitle}>
            Acompanhe nosso dia a dia, novidades e momentos mágicos no
            @mewmewnatal
          </p>
        </header>

        <div className={styles.grid}>
          {posts.slice(0, 5).map((post) => (
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
                  alt="Instagram Post"
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <ExternalLink size={24} color="#fff" />
                  <span>Ver no Instagram</span>
                </div>
              </div>
            </a>
          ))}

          <a
            href="https://www.instagram.com/mewmewnatal/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.postCard} ${styles.redirectCard}`}
          >
            <Instagram size={48} />
            <h3 className={styles.redirectText}>Ver perfil completo</h3>
            <span className={styles.redirectHandle}>@mewmewnatal</span>
          </a>
        </div>
      </div>
    </section>
  );
}
