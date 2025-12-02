import styles from "./styles.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";

export function Header() {
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

        {/* Lado Direito: Links */}
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            Home
          </Link>
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
