import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, TicketPercent, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";

/** Formata o número conforme digita: (84) 99999-9999 */
function formatWhatsApp(value: string) {
  const v = value.replace(/\D/g, "");
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

/**
 * Seção "Clube Mew" — newsletter via WhatsApp, no estilo do cupomref:
 * painel rosa com chamada, campo de número e um cupom ilustrativo.
 * O envio leva pra página de cupons com o número já preenchido.
 */
export function ClubeMewSection() {
  const navigate = useNavigate();
  const [whatsapp, setWhatsapp] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (whatsapp.length < 14) {
      setErro("Número inválido. Use o formato (XX) XXXXX-XXXX");
      return;
    }
    navigate("/cupons", { state: { whatsapp } });
  }

  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <Sparkles size={14} /> Clube Mew · Grátis
          </span>

          <h2 className={styles.title}>Ganhe mimos Mew Mew ♡</h2>

          <p className={styles.lead}>
            Deixe seu WhatsApp e resgate um cupom de desconto pra usar no caixa
            ou no pedido online. Avisamos dos eventos e novidades do cardápio
            por lá também!
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              type="tel"
              className={styles.input}
              placeholder="(84) 99999-9999"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(formatWhatsApp(e.target.value));
                setErro("");
              }}
              maxLength={15}
              aria-label="Seu número de WhatsApp"
            />
            <button type="submit" className={styles.submit}>
              Quero meu cupom
            </button>
          </form>
          {erro && <p className={styles.error}>{erro}</p>}

          <Link to="/cupons" className={styles.cuponsLink}>
            Ver cupons disponíveis pra resgatar <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cupom ilustrativo */}
        <div className={styles.visual}>
          <div className={styles.coupon}>
            <div className={styles.couponLeft}>
              <TicketPercent size={26} className={styles.couponIcon} />
              <span className={styles.couponBrand}>Cupom Mew</span>
              <span className={styles.couponHint}>
                resgate na página de cupons
              </span>
            </div>
            <div className={styles.couponRight}>
              <strong className={styles.couponValue}>mimo</strong>
              <span className={styles.couponOff}>de desconto ♡</span>
              <span className={styles.couponCode}>MEW-★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
