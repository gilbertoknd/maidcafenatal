import styles from "./styles.module.css";
import type { Event } from "../../types/Event";
import { Edit, Trash2, MapPin, CalendarDays } from "lucide-react";

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
  onToggleVisibility?: (id: number) => void;
}

export function EventCard({
  event,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleVisibility
}: EventCardProps) {
  const eventDate = new Date(event.data);
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  const maxDescLength = 50;
  const truncatedDesc = event.descricao && event.descricao.length > maxDescLength
    ? event.descricao.substring(0, maxDescLength) + "..."
    : event.descricao;

  return (
    <article className={`${styles.card} ${!event.visivel ? styles.hidden : ""}`}>
      <div className={styles.imageWrapper}>
        {event.imagem_url ? (
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}${event.imagem_url}`} 
            alt={event.titulo} 
            className={styles.image} 
          />
        ) : (
          <div className={styles.imagePlaceholder}>Sem Imagem</div>
        )}
        <div className={styles.dateBadge}>
          <span className={styles.month}>{eventDate.toLocaleString("pt-BR", { month: "short" })}</span>
          <span className={styles.day}>{eventDate.getDate().toString().padStart(2, "0")}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h3 className={styles.title}>{event.titulo}</h3>
          
          <div className={styles.details}>
            <div className={styles.infoRow}>
              <MapPin size={15} />
              <span>{event.local}</span>
            </div>
            <div className={styles.infoRow}>
              <CalendarDays size={15} />
              <span>{formattedDate}</span>
            </div>
            {event.descricao && <p className={styles.description}>{truncatedDesc}</p>}
          </div>
        </div>

        <div className={styles.bottomSection}>
          {isAdmin && (
            <div className={styles.adminActions}>
              <span className={styles.statusBadge} style={{ backgroundColor: event.visivel ? "#10b981" : "#ef4444" }}>
                 {event.visivel ? "Visível" : "Oculto"}
              </span>
              <button 
                onClick={() => onToggleVisibility && onToggleVisibility(event.id)} 
                className={styles.adminBtn} 
                title={event.visivel ? "Ocultar" : "Mostrar"}
              >
                {event.visivel ? "Ocultar" : "Mostrar"}
              </button>
              <button onClick={() => onEdit && onEdit(event)} className={`${styles.adminBtn} ${styles.editBtn}`} title="Editar">
                <Edit size={15} />
              </button>
              <button onClick={() => onDelete && onDelete(event.id)} className={`${styles.adminBtn} ${styles.deleteBtn}`} title="Excluir">
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
