import { handleScrollTop } from "../../utils/scroll";
import { WHATSAPP_URL, INSTAGRAM_URL } from "../../utils/contato";
import styles from "./styles.module.css";
import { InstagramIcon } from "../../assets/icons/InstagramIcon";
import { WhatsappIcon } from "../../assets/icons/WhatsappIcon";

const colunas = [
  {
    titulo: "Cardápio",
    links: [
      { texto: "Comidinhas", href: "/cardapio" },
      { texto: "Bebidas", href: "/cardapio" },
      { texto: "Doces & Parfaits", href: "/cardapio" },
      { texto: "Loja online", href: "/loja" },
    ],
  },
  {
    titulo: "O café",
    links: [
      { texto: "Nossas maids", href: "/#sobre" },
      { texto: "Mangateca", href: "/mangas" },
      { texto: "Eventos", href: "/eventos" },
      { texto: "Cupons", href: "/cupons" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Marca */}
          <div className={styles.brand}>
            <img
              src="/wordmark-ivory.png"
              alt="Logo Mew Mew Maid Café - Voltar ao topo"
              className={styles.wordmark}
              onClick={handleScrollTop}
              title="Voltar ao topo"
            />
            <p className={styles.description}>
              A experiência maid café mais mágica do Nordeste. Eventos
              personalizados, delivery e doces temáticos. Okaeri, mestre! ♡
            </p>
            <div className={styles.socials}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label="Siga nosso Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label="Fale conosco no WhatsApp"
              >
                <WhatsappIcon />
              </a>
            </div>
          </div>

          {/* Colunas de navegação */}
          {colunas.map((coluna) => (
            <nav className={styles.column} key={coluna.titulo}>
              <h3 className={styles.columnTitle}>{coluna.titulo}</h3>
              <ul className={styles.columnList}>
                {coluna.links.map((link) => (
                  <li key={link.texto}>
                    <a href={link.href} className={styles.columnLink}>
                      {link.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2025 Mew Mew Maid Café · Natal/RN. Feito com ♡
          </p>
          <p className={styles.note}>
            Personagens e mangás pertencem aos seus autores.
          </p>
        </div>
      </div>
    </footer>
  );
}
