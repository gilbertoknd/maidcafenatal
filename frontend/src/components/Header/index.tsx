import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styles from "./styles.module.css";
import { useNavVisibilidade } from "../../hooks/useNavVisibilidade";

const ITENS_BANNER = [
  "✦ A experiência mais mágica do Nordeste",
  "♡ Doces & comidas temáticas",
  "✦ Eventos personalizados",
  "♡ Delivery & encomendas",
  "✦ Kit Festa & aniversários",
];

const LIMITE_SCROLL_BANNER = 50;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { temLoja, temMangas } = useNavVisibilidade();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const aoRolar = () =>
      setIsBannerVisible(window.scrollY <= LIMITE_SCROLL_BANNER);

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header className={styles.header}>
      {/* Rolling banner de avisos */}
      <div
        className={`${styles.topBar} ${
          isBannerVisible ? "" : styles.topBarHidden
        }`}
        data-testid="rolling-banner"
        data-visible={isBannerVisible}
      >
        <div className={styles.marqueeTrack}>
          {/* o conteúdo é duplicado para o loop do marquee ser contínuo */}
          {[false, true].map((duplicado) => (
            <div
              key={duplicado ? "copia" : "original"}
              className={styles.marqueeContent}
              aria-hidden={duplicado || undefined}
            >
              {ITENS_BANNER.map((item) => (
                <span key={item} className={styles.topBarItem}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
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
          {temLoja && (
            <Link
              to="/loja"
              onClick={closeMenu}
              className={`${styles.navLink} ${
                location.pathname === "/loja" ? styles.active : ""
              }`}
            >
              Loja Online
            </Link>
          )}
          {temMangas && (
            <Link
              to="/mangas"
              onClick={closeMenu}
              className={`${styles.navLink} ${
                location.pathname === "/mangas" ? styles.active : ""
              }`}
            >
              Mangás
            </Link>
          )}
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

          <Link to="/agendar" className={styles.cta} onClick={closeMenu}>
            Agendar evento
          </Link>
        </nav>
      </div>
    </header>
  );
}
