import styles from "./styles.module.css";
import { ClockIcon } from "../../assets/icons/ClockIcon";
import { LocationIcon } from "../../assets/icons/LocationIcon";
import { SparkleIcon } from "../../assets/icons/SparkleIcon";

export function AboutSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Sobre o Mew Mew</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.infoCard}>
          <div className={styles.iconWrapper}>
            <ClockIcon />
          </div>
          <h3>Horários</h3>
          <p>Terça a Domingo</p>
          <p>15h às 22h</p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.iconWrapper}>
            <LocationIcon />
          </div>
          <h3>Localização</h3>
          <p>Rua das Flores, 123</p>
          <p>Natal, RN</p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.iconWrapper}>
            <SparkleIcon />
          </div>
          <h3>Nosso Lema</h3>
          <p>Magia e sabor</p>
          <p>em cada detalhe!</p>
        </div>
      </div>
    </section>
  );
}
