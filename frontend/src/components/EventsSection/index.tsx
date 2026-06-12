import { Link } from "react-router-dom";
import { CalendarHeart, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";
import { INSTAGRAM_URL } from "../../utils/contato";

interface EventoFixo {
  dia: string;
  detalhe: string;
  titulo: string;
  descricao: string;
  pill: string;
  link: string;
}

const eventosFixos: EventoFixo[] = [
  {
    dia: "Sex",
    detalhe: "& sáb",
    titulo: "Café das Maids",
    descricao: "Performances, dancinhas e fotos com a equipe.",
    pill: "Toda semana",
    link: "/eventos",
  },
  {
    dia: "Sáb",
    detalhe: "tarde",
    titulo: "Eventos temáticos",
    descricao: "Cosplay, datas especiais e encontros otaku.",
    pill: "Ver agenda",
    link: "/eventos",
  },
  {
    dia: "Todo",
    detalhe: "dia",
    titulo: "Festa de aniversário",
    descricao:
      "Aniversariante ganha sobremesa de cortesia; espaço climatizado p/ 15–30 pessoas.",
    pill: "Reservar",
    link: "/agendar",
  },
  {
    dia: "Dom",
    detalhe: "família",
    titulo: "Domingo em família",
    descricao: "Ambiente lúdico pra todas as idades, das 11h às 19h.",
    pill: "Aberto",
    link: "/eventos",
  },
];

/**
 * Seção de eventos da homepage — agenda fixa da semana em cards
 * horizontais (dia · evento · status), com atalhos para a página
 * de eventos e para o agendamento.
 */
export function EventsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Tem sempre algo fofo rolando</h2>
        <p className={styles.lead}>
          Eventos temáticos, performances e festas. Acompanhe o{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igLink}
          >
            @mewmewnatal
          </a>{" "}
          pra novidades.
        </p>
      </div>

      <div className={styles.list}>
        {eventosFixos.map((evento) => (
          <Link to={evento.link} className={styles.row} key={evento.titulo}>
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
        <Link to="/eventos" className={styles.ctaPrimary}>
          <CalendarHeart size={18} /> Ver agenda completa
        </Link>
        <Link to="/agendar" className={styles.ctaSecondary}>
          Agendar evento <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
