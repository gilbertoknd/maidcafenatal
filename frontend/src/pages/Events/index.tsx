import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import styles from "./styles.module.css";
import { getEvents } from "../../services/api";
import type { Event } from "../../types/Event";
import { EventCard } from "../../components/EventCard";
import { EventCalendar } from "../../components/EventCalendar";

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <section className={styles.heroSection}>
          <h1 className={styles.title}>Próximos Eventos</h1>
          <p className={styles.subtitle}>
            Acompanhe a agenda do Mew Mew Café e não perca nossos eventos
            mágicos!
          </p>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.calendarWrapper}>
            <h2 className={styles.sectionTitle}>Calendário</h2>
            <EventCalendar 
              events={events} 
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                  setSelectedDate(null);
                } else {
                  setSelectedDate(date);
                }
              }}
            />
          </div>

          <div className={styles.eventsList}>
            <h2 className={styles.sectionTitle}>
              {selectedDate ? `Eventos do Dia ${selectedDate.toLocaleDateString("pt-BR")}` : "Detalhes dos Eventos"}
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  className={styles.seeAllBtn}
                >
                  Ver Todos
                </button>
              )}
            </h2>
            {loading ? (
              <p>Carregando eventos...</p>
            ) : events.length === 0 ? (
              <p className={styles.empty}>
                Nenhum evento programado no momento.
              </p>
            ) : (
              <div className={styles.grid}>
                {(selectedDate 
                  ? events.filter(e => new Date(e.data).toDateString() === selectedDate.toDateString())
                  : events
                ).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
