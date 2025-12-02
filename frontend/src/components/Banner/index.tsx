import styles from "./styles.module.css";

export function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <img
        src="/Jua.jpg"
        alt="Banner Mew Mew Café"
        className={styles.bannerImage}
      />
    </div>
  );
}
