import styles from "./styles.module.css";
import { ClockIcon } from "../../assets/icons/ClockIcon";
import { LocationIcon } from "../../assets/icons/LocationIcon";
import { WhatsappIcon } from "../../assets/icons/WhatsappIcon";

export function AboutSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Sobre o Mew Mew</h2>
      <div className={styles.cardsContainer}>
        <a
          href="https://chat.whatsapp.com/GYF1jlmSvdE5wMlpFvWFIe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Entre no nosso grupo do WhatsApp"
          className={styles.cardLink}
        >
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <WhatsappIcon width="32" height="32" />
            </div>
            <h3>Vilarejo</h3>
            <p>Acesse o link e participe do nosso mundo mágico!</p>
          </div>
        </a>

        <div className={styles.infoCard}>
          <div className={styles.iconWrapper}>
            <ClockIcon />
          </div>
          <h3>Horários</h3>
          <p>
            <strong>Terça-Domingo</strong> <br /> DELIVERY ABERTO!
            <br />
            <strong>Quarta e Quinta</strong> <br /> 14 às 21h
            <br />
            <strong>Sexta-Domingo</strong> <br /> 14h às 22h
          </p>
        </div>

        <a
          href="https://maps.app.goo.gl/4rQwYJmjEe1rudGd7"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Localização do Mew Mew"
          className={styles.cardLink}
        >
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <LocationIcon />
            </div>
            <h3>Localização</h3>
            <p>
              Rua Camilo de Paula, 2, Tirol <br />
              Natal - RN
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
