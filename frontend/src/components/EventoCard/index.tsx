import styles from "./styles.module.css";
import type { Evento } from "../../types/Evento";
import { Edit, Trash2, MapPin, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatEventDate } from "../../utils/formatadores";

interface EventoCardProps {
  evento: Evento;
  isAdmin?: boolean;
  onEdit?: (evento: Evento) => void;
  onDelete?: (id: number) => void;
  onToggleVisibility?: (id: number) => void;
}

export function EventoCard({
  evento,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleVisibility
}: EventoCardProps) {
  const navigate = useNavigate();
  const eventoDate = new Date(evento.data);
  const formattedDate = formatEventDate(evento.data, evento.data_fim);

  const maxDescLength = 50;
  const truncatedDesc = evento.descricao && evento.descricao.length > maxDescLength
    ? evento.descricao.substring(0, maxDescLength) + "..."
    : evento.descricao;

  const formatarBadgeRange = (dataStr: string, dataFimStr: string): string => {
    const start = new Date(dataStr);
    const end = new Date(dataFimStr);
    
    const formataMes = (d: Date) => {
      const m = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
      return m.charAt(0).toUpperCase() + m.slice(1);
    };
    
    const startDay = start.getDate().toString().padStart(2, "0");
    const startMonth = formataMes(start);
    
    const endDay = end.getDate().toString().padStart(2, "0");
    const endMonth = formataMes(end);

    if (start.toDateString() === end.toDateString()) {
      return `${startMonth}. ${startDay}`;
    }

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${startMonth}. ${startDay} - ${endDay}`;
    }

    return `${startMonth}. ${startDay} - ${endMonth}. ${endDay}`;
  };

  return (
    <article 
      className={`${styles.card} ${!evento.visivel ? styles.hidden : ""} ${styles.clickable}`}
      onClick={() => navigate(`/eventos/${evento.id}`)}
    >
      <div className={styles.imageWrapper}>
        {evento.imagem_url ? (
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}${evento.imagem_url}`} 
            alt={evento.titulo} 
            className={styles.image} 
          />
        ) : (
          <div className={styles.imagePlaceholder}>Sem Imagem</div>
        )}
        <div className={styles.dateBadge}>
          {!evento.data_fim ? (
            <>
              <span className={styles.month}>{eventoDate.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}</span>
              <span className={styles.day}>{eventoDate.getDate().toString().padStart(2, "0")}</span>
            </>
          ) : (
            <span className={styles.range}>
              {formatarBadgeRange(evento.data, evento.data_fim)}
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h3 className={styles.title}>{evento.titulo}</h3>
          
          <div className={styles.details}>
            <div className={styles.infoRow}>
              <MapPin size={15} />
              <span>{evento.local}</span>
            </div>
            <div className={styles.infoRow}>
              <CalendarDays size={15} />
              <span>{formattedDate}</span>
            </div>
            {evento.descricao && <p className={styles.description}>{truncatedDesc}</p>}
          </div>
        </div>

        {isAdmin && (
          <div className={styles.bottomSection}>
            <div className={styles.adminActions}>
              <span className={`${styles.statusBadge} ${evento.visivel ? styles.statusBadgeVisible : styles.statusBadgeHidden}`}>
                 {evento.visivel ? "Visível" : "Oculto"}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility?.(evento.id);
                }} 
                className={styles.adminBtn} 
                title={evento.visivel ? "Ocultar" : "Mostrar"}
              >
                {evento.visivel ? "Ocultar" : "Mostrar"}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(evento);
                }} 
                className={`${styles.adminBtn} ${styles.editBtn}`} 
                title="Editar"
              >
                <Edit size={15} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(evento.id);
                }} 
                className={`${styles.adminBtn} ${styles.deleteBtn}`} 
                title="Excluir"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
