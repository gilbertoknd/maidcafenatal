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
  const [viewedMonth, setViewedMonth] = useState<Date>(new Date());

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

  const isViewingCurrentMonth = 
    viewedMonth.getMonth() === new Date().getMonth() && 
    viewedMonth.getFullYear() === new Date().getFullYear();
    
  const isSelectedToday = 
    selectedDate && selectedDate.toDateString() === new Date().toDateString();

  const todayDateOnly = new Date();
  todayDateOnly.setHours(0, 0, 0, 0);

  const displayedEvents = events.filter((e) => {
    const eDate = new Date(e.data);
    const eventDateOnly = new Date(eDate);
    eventDateOnly.setHours(0, 0, 0, 0);

    if (selectedDate) {
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);
      return eventDateOnly.getTime() >= selectedDateOnly.getTime();
    }

    const isCurrentRealMonthAndYear = 
      todayDateOnly.getMonth() === viewedMonth.getMonth() && 
      todayDateOnly.getFullYear() === viewedMonth.getFullYear();

    let filterStartDate;
    if (isCurrentRealMonthAndYear) {
      filterStartDate = todayDateOnly.getTime();
    } else {
      const startOfViewedMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1);
      filterStartDate = startOfViewedMonth.getTime();
    }

    return eventDateOnly.getTime() >= filterStartDate;
  });

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
              onMonthChange={setViewedMonth}
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
              {selectedDate ? `Eventos a partir de ${selectedDate.toLocaleDateString("pt-BR")}` : "Próximos Eventos"}
              {(!isViewingCurrentMonth || (selectedDate && !isSelectedToday)) && (
                <button 
                  onClick={() => {
                    const now = new Date();
                    setSelectedDate(now);
                    setViewedMonth(now);
                  }}
                  className={styles.seeAllBtn}
                >
                  Voltar para Hoje
                </button>
              )}
            </h2>
            {loading ? (
              <p>Carregando eventos...</p>
            ) : displayedEvents.length === 0 ? (
              <p className={styles.empty}>
                Nenhum evento programado para este período.
              </p>
            ) : (
              <div className={styles.grid}>
                {displayedEvents
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .map((event) => (
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
