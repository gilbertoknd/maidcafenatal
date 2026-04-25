import { handleScrollTop } from "../../utils/scroll";
import styles from "./styles.module.css";
import { InstagramIcon } from "../../assets/icons/InstagramIcon";
import { WhatsappIcon } from "../../assets/icons/WhatsappIcon";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <img
          src={"Logo.svg"}
          alt="Logo Mew Mew Café - Voltar ao Topo"
          className={styles.logo}
          onClick={handleScrollTop}
          title="Voltar ao topo"
        />

        <h2 className={styles.title}>Mew Mew Maid Café</h2>

        <p className={styles.phrase}>A experiência mais mágica da cidade ✨️💖</p>

        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/mewmewnatal/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="Siga nosso Instagram"
          >
            <InstagramIcon />
          </a>

          <a
            href="https://wa.me/558486643897"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="Fale conosco no WhatsApp"
          >
            <WhatsappIcon />
          </a>
        </div>

        {/*Copyright*/}
        <p style={{ fontSize: "0.8rem", marginTop: "1rem" }}>
          © 2024 Mew Mew Maid Café. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
