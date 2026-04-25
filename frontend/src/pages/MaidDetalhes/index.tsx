import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { buscarMaidPorId } from "../../data/maidsData";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import styles from "./styles.module.css";

/**
 * Página de detalhes individuais de uma Maid.
 * Exibe foto grande, nome, descrição completa e CTA para o cardápio.
 */
export function MaidDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const maid = buscarMaidPorId(id || "");

  if (!maid) {
    return (
      <>
        <Header />
        <div className={styles.notFound}>
          <p className={styles.notFoundTitle}>Maid não encontrada 😿</p>
          <p>A maid que você procura não existe no nosso café.</p>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={20} /> Voltar para Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/")}
          aria-label="Voltar"
        >
          <ChevronLeft size={20} /> Voltar
        </button>

        <div className={styles.maidDetails}>
          <div className={styles.imageContainer}>
            <img
              src={maid.imagem}
              alt={maid.nome}
              className={styles.image}
            />
            <div
              className={styles.colorBorder}
              style={{ backgroundColor: maid.cor }}
            />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{maid.nome}</h1>

            <span
              className={styles.badge}
              style={{ backgroundColor: maid.cor }}
            >
              <Heart size={14} /> Maid do Mew Mew Café
            </span>

            <p className={styles.descricaoBreve}>{maid.descricaoBreve}</p>

            <p className={styles.descricaoCompleta}>
              {maid.descricaoCompleta}
            </p>

            <div className={styles.maidFooter}>
              <Link to="/cardapio" className={styles.ctaButton}>
                Ver Cardápio 🍰
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
