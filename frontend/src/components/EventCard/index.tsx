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

  return (
    <article className={`${styles.card} ${!event.visivel ? styles.hidden : ""}`}>
      {event.imagem_url && (
        <div className={styles.imageContainer}>
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}${event.imagem_url}`} 
            alt={event.titulo} 
            className={styles.image} 
          />
        </div>
      )}
      {/* Date Badge */}
      <div className={styles.dateBadge}>
        <span className={styles.day}>{eventDate.getDate().toString().padStart(2, "0")}</span>
        <span className={styles.month}>{eventDate.toLocaleString("pt-BR", { month: "short" })}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{event.titulo}</h3>
        {event.descricao && <p className={styles.description}>{event.descricao}</p>}

        <div className={styles.details}>
          <div className={styles.infoRow}>
            <CalendarDays size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className={styles.infoRow}>
            <MapPin size={16} />
            <span>{event.local}</span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className={styles.adminFooter}>
          <span className={styles.statusBadge} style={{ backgroundColor: event.visivel ? "#10b981" : "#ef4444" }}>
            {event.visivel ? "Visível" : "Oculto"}
          </span>
          <div className={styles.adminActions}>
            <button
              onClick={() => onToggleVisibility && onToggleVisibility(event.id)}
              className={styles.adminBtn}
              title={event.visivel ? "Ocultar" : "Mostrar"}
            >
              {event.visivel ? "Ocultar" : "Mostrar"}
            </button>
            <button
              onClick={() => onEdit && onEdit(event)}
              className={`${styles.adminBtn} ${styles.editBtn}`}
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(event.id)}
              className={`${styles.adminBtn} ${styles.deleteBtn}`}
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
