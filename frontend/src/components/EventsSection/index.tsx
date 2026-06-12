import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarHeart, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";
import { INSTAGRAM_URL } from "../../utils/contato";
import { buscarConfiguracoes } from "../../services/api";
import { parseHomeEventos } from "../../utils/homeEventos";

/** Renderiza o subtítulo transformando o @mewmewnatal em link pro IG. */
function Subtitulo({ texto }: { texto: string }) {
  const partes = texto.split("@mewmewnatal");
  return (
    <p className={styles.lead}>
      {partes.map((parte, i) => (
        <span key={i}>
          {i > 0 && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igLink}
            >
              @mewmewnatal
            </a>
          )}
          {parte}
        </span>
      ))}
    </p>
  );
}

/**
 * Seção de eventos da homepage — agenda fixa da semana em cards
 * horizontais (dia · evento · status), com atalhos para a página
 * de eventos e para o agendamento. Conteúdo editável pelo painel
 * admin (aba "Agenda da Home"), salvo na configuração `home_eventos`.
 */
export function EventsSection() {
  const { data } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 1000 * 60 * 5,
  });

  const config = parseHomeEventos(data?.configuracoes?.home_eventos);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{config.titulo}</h2>
        <Subtitulo texto={config.subtitulo} />
      </div>

      <div className={styles.list}>
        {config.cards.map((evento, index) => (
          <Link
            to={evento.link}
            className={styles.row}
            key={`${evento.titulo}-${index}`}
          >
            <div className={styles.day}>
              <span className={styles.dayMain}>{evento.dia}</span>
              <span className={styles.dayDetail}>{evento.detalhe}</span>
            </div>
            <div className={styles.info}>
              <h3 className={styles.rowTitle}>{evento.titulo}</h3>
              <p className={styles.rowText}>{evento.descricao}</p>
            </div>
            <span className={styles.pill}>{evento.pill}</span>
          </Link>
        ))}
      </div>

      <div className={styles.actions}>
        <Link to={config.ctaPrimarioLink} className={styles.ctaPrimary}>
          <CalendarHeart size={18} /> {config.ctaPrimarioTexto}
        </Link>
        <Link to={config.ctaSecundarioLink} className={styles.ctaSecondary}>
          {config.ctaSecundarioTexto} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
