import styles from "./styles.module.css";

export function VideoBanner() {
  return (
    <div className={`${styles.bannerContainer} ${styles.videoMode}`}>
      <video
        src="/NovosDrinks.mp4"
        className={styles.bannerMedia}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay}>
        <h2 className={styles.overlayTitle}>
          Novos Drinks Mágicos <br /> Esperando por Você!
        </h2>
        <button
          className={styles.scrollButton}
          onClick={() => {
            document
              .getElementById("inicio")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explorar o Café
        </button>
      </div>
    </div>
  );
}

export function ImageBanner() {
  return (
    <div className={`${styles.bannerContainer} ${styles.imageMode}`}>
      <img
        src="/Jua.jpg"
        alt="Banner Mew Mew Café"
        className={styles.bannerMedia}
      />
    </div>
  );
}

// Default export for backward compatibility if needed, or remove it to force named imports
export const Banner = VideoBanner;
