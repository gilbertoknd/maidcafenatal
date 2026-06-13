import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./styles.module.css";
import { useBanners } from "../../hooks/useBanners";

/**
 * Banner de vídeo fullscreen exclusivo da Home.
 * Preenche 100vh quando o usuário entra no site;
 * ao scrollar, desaparece com transição suave.
 */

const LIMITE_SCROLL_BANNER = 200;

export function HomeBanner() {
  const { data: banners, isLoading } = useBanners();
  const [isVisible, setIsVisible] = useState(true);

  const aoRolar = useCallback(() => {
    setIsVisible(window.scrollY <= LIMITE_SCROLL_BANNER);
  }, []);

  useEffect(() => {
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, [aoRolar]);

  if (isLoading) {
    return (
      <div
        className={`${styles.homeBannerContainer} ${styles.homeBannerLoading}`}
        data-testid="home-video-banner"
        data-visible="true"
      />
    );
  }

  const bannerAtual =
    banners?.find((b) => b.pagina === "home") ||
    banners?.find((b) => b.pagina === "padrao");

  const tipo = bannerAtual?.tipo || "video";
  const isVideo = tipo === "video";
  const mediaUrl = bannerAtual?.url || "/Jua.jpg";

  const titulo = bannerAtual?.titulo;
  const subtitulo = bannerAtual?.subtitulo;
  const textoBotao = bannerAtual?.texto_botao;
  const linkBotao = bannerAtual?.link_botao;

  return (
    <div
      className={`${styles.homeBannerContainer} ${!isVisible ? styles.homeBannerHidden : ""}`}
      data-testid="home-video-banner"
      data-visible={isVisible ? "true" : "false"}
    >
      {isVideo ? (
        <video
          src={mediaUrl}
          className={styles.homeBannerVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={mediaUrl}
          className={styles.homeBannerImage}
          alt="Banner Mew Mew Café"
        />
      )}

      {(titulo || subtitulo || textoBotao) && (
        <div className={styles.homeBannerOverlay}>
          {titulo && <h2 className={styles.homeBannerTitle}>{titulo}</h2>}
          {subtitulo && (
            <p className={styles.homeBannerSubtitle}>{subtitulo}</p>
          )}
          {textoBotao && (
            <button
              className={styles.homeBannerCta}
              onClick={() => {
                if (linkBotao?.startsWith("#")) {
                  document
                    .querySelector(linkBotao)
                    ?.scrollIntoView({ behavior: "smooth" });
                } else if (linkBotao) {
                  window.location.href = linkBotao;
                }
              }}
            >
              {textoBotao}
            </button>
          )}
        </div>
      )}

      {/* Indicador de scroll para baixo */}
      {isVisible && (
        <div className={styles.scrollIndicator}>
          <ChevronDown size={24} />
        </div>
      )}
    </div>
  );
}
