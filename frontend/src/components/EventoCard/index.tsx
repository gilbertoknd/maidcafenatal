import styles from "./styles.module.css";
import type { Evento } from "../../types/Evento";
import { Edit, Trash2, MapPin, CalendarDays } from "lucide-react";

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
  const eventoDate = new Date(evento.data);
  const formattedDate = eventoDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  const maxDescLength = 50;
  const truncatedDesc = evento.descricao && evento.descricao.length > maxDescLength
    ? evento.descricao.substring(0, maxDescLength) + "..."
    : evento.descricao;

  return (
    <article className={`${styles.card} ${!evento.visivel ? styles.hidden : ""}`}>
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
          <span className={styles.month}>{eventoDate.toLocaleString("pt-BR", { month: "short" })}</span>
          <span className={styles.day}>{eventoDate.getDate().toString().padStart(2, "0")}</span>
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

        <div className={styles.bottomSection}>
          {isAdmin && (
            <div className={styles.adminActions}>
              <span className={styles.statusBadge} style={{ backgroundColor: evento.visivel ? "#10b981" : "#ef4444" }}>
                 {evento.visivel ? "Visível" : "Oculto"}
              </span>
              <button 
                onClick={() => onToggleVisibility && onToggleVisibility(evento.id)} 
                className={styles.adminBtn} 
                title={evento.visivel ? "Ocultar" : "Mostrar"}
              >
                {evento.visivel ? "Ocultar" : "Mostrar"}
              </button>
              <button onClick={() => onEdit && onEdit(evento)} className={`${styles.adminBtn} ${styles.editBtn}`} title="Editar">
                <Edit size={15} />
              </button>
              <button onClick={() => onDelete && onDelete(evento.id)} className={`${styles.adminBtn} ${styles.deleteBtn}`} title="Excluir">
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
