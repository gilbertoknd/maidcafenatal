import { useState, type CSSProperties } from "react";
import { Globe, Instagram, MessageCircle } from "lucide-react";
import type { Parceiro, TipoLinkParceiro } from "../../data/parceirosData";
import styles from "./styles.module.css";

/** Ícone lucide correspondente a cada tipo de link. */
const ICONES = {
  site: Globe,
  instagram: Instagram,
  whatsapp: MessageCircle,
} as const;

/** Rótulo acessível de cada tipo de link (todos abrem em nova aba). */
const ROTULOS_ACESSIVEIS: Record<TipoLinkParceiro, (nome: string) => string> = {
  site: (nome) => `Abrir o site da ${nome} em nova aba`,
  instagram: (nome) => `Abrir o Instagram da ${nome} em nova aba`,
  whatsapp: (nome) => `Falar com a ${nome} no WhatsApp em nova aba`,
};

interface ParceiroCardProps {
  parceiro: Parceiro;
}

/**
 * Card sticker de um parceiro — compartilhado pela seção da home e pela
 * página /parceiros.
 *
 * A logo tem fallback para um monograma com as iniciais sobre a cor do
 * parceiro. O monograma é o estado padrão enquanto não há arquivos em
 * public/parceiros, por isso tem acabamento próprio (borda sticker +
 * fonte display) em vez de parecer uma imagem quebrada.
 */
export function ParceiroCard({ parceiro }: ParceiroCardProps) {
  const [logoFalhou, setLogoFalhou] = useState(false);

  return (
    <article
      className={styles.card}
      style={{ "--parceiro-cor": parceiro.cor } as CSSProperties}
    >
      <div className={styles.logoWrapper}>
        {logoFalhou ? (
          <span className={styles.monograma} aria-hidden="true">
            {parceiro.iniciais}
          </span>
        ) : (
          <img
            src={parceiro.logo}
            alt={`Logo da ${parceiro.nome}`}
            className={styles.logo}
            loading="lazy"
            onError={() => setLogoFalhou(true)}
          />
        )}
      </div>

      <h3 className={styles.nome}>{parceiro.nome}</h3>
      <p className={styles.descricao}>{parceiro.descricaoBreve}</p>

      <div className={styles.links}>
        {parceiro.links.map((link) => {
          const Icone = ICONES[link.tipo];

          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={ROTULOS_ACESSIVEIS[link.tipo](parceiro.nome)}
            >
              <Icone size={15} aria-hidden="true" />
              <span>{link.rotulo}</span>
            </a>
          );
        })}
      </div>
    </article>
  );
}
