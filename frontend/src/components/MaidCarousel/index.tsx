import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { maids } from "../../data/maidsData";
import styles from "./styles.module.css";

/**
 * Carrossel de Maids com divisão diagonal.
 * Exibe 2 maids por slide com clip-path diagonal,
 * hover para detalhes e scroll horizontal.
 */
export function MaidCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Agrupar maids em pares para os slides
  const slides: (typeof maids)[] = [];
  for (let i = 0; i < maids.length; i += 2) {
    slides.push(maids.slice(i, i + 2));
  }

  const totalSlides = slides.length;

  const scrollToSlide = useCallback(
    (index: number) => {
      if (!trackRef.current) return;
      const slideWidth = trackRef.current.clientWidth;
      trackRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
      setActiveSlide(index);
    },
    []
  );

  const handlePrev = () => {
    const newIndex = activeSlide > 0 ? activeSlide - 1 : totalSlides - 1;
    scrollToSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeSlide < totalSlides - 1 ? activeSlide + 1 : 0;
    scrollToSlide(newIndex);
  };

  // Sincronizar scroll manual com os dots
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const slideWidth = track.clientWidth;
      if (slideWidth === 0) return;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      setActiveSlide(newIndex);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Nossas Maids ✨</h2>

      <div className={styles.carouselContainer}>
        {/* Botão anterior */}
        <button
          className={`${styles.navButton} ${styles.navPrev}`}
          onClick={handlePrev}
          aria-label="Maid anterior"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Track do carrossel */}
        <div className={styles.carouselTrack} ref={trackRef}>
          {slides.map((pair, slideIndex) => (
            <div className={styles.slide} key={slideIndex}>
              {pair.map((maid) => (
                <Link
                  to={`/maids/${maid.id}`}
                  key={maid.id}
                  className={`${styles.maidPanel} ${
                    pair.length === 1 ? styles.maidPanelSolo : ""
                  }`}
                  aria-label={`Conhecer ${maid.nome}`}
                >
                  <img
                    src={maid.imagem}
                    alt={maid.nome}
                    className={styles.maidImage}
                    loading={slideIndex === 0 ? "eager" : "lazy"}
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.maidName}>{maid.nome}</h3>
                    <p className={styles.maidDescription}>
                      {maid.descricaoBreve}
                    </p>
                    <span className={styles.meetMe}>
                      Conheça-me <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Botão próximo */}
        <button
          className={`${styles.navButton} ${styles.navNext}`}
          onClick={handleNext}
          aria-label="Próxima maid"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots de navegação */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === activeSlide ? styles.dotActive : ""
            }`}
            onClick={() => scrollToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
