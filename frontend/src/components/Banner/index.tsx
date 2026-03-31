import styles from "./styles.module.css";
import { useBanners } from "../../hooks/useBanners";

interface BannerProps {
  pagina: "home" | "cardapio" | "eventos" | "loja" | "padrao";
}

export function Banner({ pagina }: BannerProps) {
  const { data: banners, isLoading } = useBanners();

  if (isLoading) return <div className={styles.bannerContainer} style={{ height: "400px" }} />;

  const bannerAtual = banners?.find(b => b.pagina === pagina) || banners?.find(b => b.pagina === "padrao");

  // Fallback absoluto
  const tipo = bannerAtual?.tipo || "image";
  const isVideo = tipo === "video";
  const mediaUrl = bannerAtual?.url || "/Jua.jpg";
  
  const titulo = bannerAtual?.titulo;
  const subtitulo = bannerAtual?.subtitulo;
  const textoBotao = bannerAtual?.texto_botao;
  const linkBotao = bannerAtual?.link_botao;

  return (
    <div className={`${styles.bannerContainer} ${isVideo ? styles.videoMode : styles.imageMode}`}>
      {isVideo ? (
        <video
          src={mediaUrl}
          className={styles.bannerMedia}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={mediaUrl}
          className={styles.bannerMedia}
          alt={`Banner Mew Mew Café - ${pagina}`}
        />
      )}

      {(titulo || subtitulo || textoBotao) && (
        <div className={styles.overlay}>
          {titulo && (
            <h2 className={styles.overlayTitle}>
              {titulo} {subtitulo && <><br /> {subtitulo}</>}
            </h2>
          )}
          {textoBotao && (
            <button
              className={styles.scrollButton}
              onClick={() => {
                if (linkBotao?.startsWith("#")) {
                   document.querySelector(linkBotao)?.scrollIntoView({ behavior: "smooth" });
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
    </div>
  );
}

// Mantendo exports originais temporariamente caso algo tenha quebrado, atrelando aos novos propósitos
export const VideoBanner = () => <Banner pagina="home" />;
export const ImageBanner = () => <Banner pagina="padrao" />;
