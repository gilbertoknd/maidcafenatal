import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styles from "./styles.module.css";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      {/* Faixa de avisos */}
      <div className={styles.topBar}>
        <span className={styles.topBarItem}>
          ✦ O primeiro maid &amp; mangá café do Nordeste
        </span>
        <span className={styles.topBarItem}>♡ Mangateca à vontade</span>
        <span className={styles.topBarItem}>✦ Natal / RN</span>
      </div>

      <div className={styles.container}>
        {/* Lado Esquerdo: Wordmark */}
        <div
          className={styles.brandContainer}
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
        >
          <img
            src="/wordmark-cardinal.png"
            alt="Mew Mew Café"
            className={styles.logo}
          />
          <span className={styles.brandName}>Mew Mew Café</span>
        </div>

        {/* Botão Hamburger (Mobile Only) */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Lado Direito: Links */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link
            to="/"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Início
          </Link>
          <Link
            to="/cardapio"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/cardapio" ? styles.active : ""
            }`}
          >
            Cardápio
          </Link>
          <Link
            to="/loja"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/loja" ? styles.active : ""
            }`}
          >
            Loja Online
          </Link>
          <Link
            to="/mangas"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/mangas" ? styles.active : ""
            }`}
          >
            Mangás
          </Link>
          <Link
            to="/eventos"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/eventos" ? styles.active : ""
            }`}
          >
            Eventos
          </Link>
          <Link
            to="/cupons"
            onClick={closeMenu}
            className={`${styles.navLink} ${
              location.pathname === "/cupons" ? styles.active : ""
            }`}
          >
            Cupons
          </Link>

          <a
            href="https://wa.me/558486643897"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            onClick={closeMenu}
          >
            Reservar mesa
          </a>
        </nav>
      </div>
    </header>
  );
}
