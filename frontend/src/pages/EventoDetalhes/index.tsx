import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarEventoPorId } from "../../services/api";
import type { Evento } from "../../types/Evento.ts";
import { Calendar, MapPin, ChevronLeft } from "lucide-react";
import styles from "./styles.module.css";
import { formatEventDate } from "../../utils/formatadores";

export function EventoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadEvento() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await buscarEventoPorId(id);
        setEvento(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadEvento();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Carregando os detalhes do evento... 🌸</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className={styles.error}>
        <p>Oops! Não conseguimos encontrar este evento. 😿</p>
        <button className={styles.backBtn} onClick={() => navigate("/eventos")}>
          Voltar para Eventos
        </button>
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  
  const dataFormatada = formatEventDate(evento.data, evento.data_fim);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/eventos")}>
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className={styles.eventDetails}>
        <div className={styles.imageContainer}>
          <img
            src={`${backendUrl}${evento.imagem_url}`}
            alt={evento.titulo}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/800x450?text=Maid+Café+Evento";
            }}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{evento.titulo}</h1>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={20} />
              <span>{dataFormatada}</span>
            </div>
            <div className={styles.metaItem}>
              <MapPin size={20} />
              <span>{evento.local}</span>
            </div>
          </div>

          <div className={styles.description}>
            {evento.descricao}
          </div>
        </div>
      </div>
    </div>
  );
}
