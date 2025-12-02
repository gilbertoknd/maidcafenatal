import { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Lado Esquerdo: Logo Box e Nome */}
        <div className={styles.brandContainer} onClick={() => navigate("/")}>
          <img src={"/Logo.svg"} alt="Logo Mew Mew" className={styles.logo} />
          <span className={styles.brandName}>Mew Mew Café</span>
        </div>

        {/* Botão Mobile */}
        <button
          className={styles.mobileBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {/* (Ícone de hambúrguer igual ao anterior) */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Lado Direito: Links */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <Link
            to="/cardapio"
            className={`${styles.navLink} ${
              location.pathname === "/cardapio" ? styles.active : ""
            }`}
          >
            Cardápio
          </Link>
        </nav>
      </div>
    </header>
  );
}
