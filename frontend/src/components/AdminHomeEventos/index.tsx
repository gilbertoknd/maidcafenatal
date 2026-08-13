import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import { buscarConfiguracoes, atualizarConfiguracoes } from "../../services/api";
import {
  HOME_EVENTOS_PADRAO,
  parseHomeEventos,
} from "../../utils/homeEventos";
import type {
  HomeEventoCard,
  HomeEventosConfig,
} from "../../types/Configuracao";
import styles from "./styles.module.css";

const CARD_VAZIO: HomeEventoCard = {
  dia: "",
  detalhe: "",
  titulo: "",
  descricao: "",
  pill: "",
  link: "/eventos",
};

/**
 * Aba do painel admin para editar a seção "Tem sempre algo fofo rolando"
 * da home: textos, cards da agenda (dia, título, descrição, pill e link)
 * e os botões de chamada. Persistido como JSON na configuração
 * `home_eventos`.
 */
export function AdminHomeEventos() {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<HomeEventosConfig>(HOME_EVENTOS_PADRAO);
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
  });

  // Dado já aplicado ao formulário — re-semeia quando a query devolve dados
  // novos. Ajuste durante o render, não em useEffect (viola
  // react-hooks/set-state-in-effect).
  const [dadoOrigem, setDadoOrigem] = useState<typeof data>(undefined);

  if (data && data !== dadoOrigem) {
    setDadoOrigem(data);
    setConfig(parseHomeEventos(data.configuracoes?.home_eventos));
  }

  const mutationSalvar = useMutation({
    mutationFn: atualizarConfiguracoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      alert("Seção de eventos da home salva com sucesso!");
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "Erro ao salvar a seção");
    },
  });

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    mutationSalvar.mutate({ home_eventos: JSON.stringify(config) });
  }

  function atualizarCampo<K extends keyof HomeEventosConfig>(
    campo: K,
    valor: HomeEventosConfig[K],
  ) {
    setConfig((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarCard(
    index: number,
    campo: keyof HomeEventoCard,
    valor: string,
  ) {
    setConfig((atual) => ({
      ...atual,
      cards: atual.cards.map((card, i) =>
        i === index ? { ...card, [campo]: valor } : card,
      ),
    }));
  }

  function adicionarCard() {
    setConfig((atual) => ({
      ...atual,
      cards: [...atual.cards, { ...CARD_VAZIO }],
    }));
  }

  function removerCard(index: number) {
    if (config.cards.length === 1) {
      setErrorMsg("A seção precisa de pelo menos um card.");
      return;
    }
    setConfig((atual) => ({
      ...atual,
      cards: atual.cards.filter((_, i) => i !== index),
    }));
  }

  function moverCard(index: number, direcao: -1 | 1) {
    setConfig((atual) => {
      const destino = index + direcao;
      if (destino < 0 || destino >= atual.cards.length) return atual;
      const cards = [...atual.cards];
      [cards[index], cards[destino]] = [cards[destino], cards[index]];
      return { ...atual, cards };
    });
  }

  function restaurarPadrao() {
    if (
      window.confirm(
        "Restaurar o conteúdo padrão da seção? As alterações não salvas serão perdidas.",
      )
    ) {
      setConfig(HOME_EVENTOS_PADRAO);
    }
  }

  if (isLoading) {
    return <p className={styles.loading}>Carregando configurações...</p>;
  }

  return (
    <form className={styles.container} onSubmit={handleSalvar}>
      <h2 className={styles.formTitle}>Agenda da Home</h2>
      <p className={styles.help}>
        Edite a seção "{HOME_EVENTOS_PADRAO.titulo}" exibida na página
        inicial. Links internos começam com "/" (ex.: /eventos, /agendar);
        no subtítulo, o texto @mewmewnatal vira link pro Instagram
        automaticamente.
      </p>

      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      <section className={styles.bloco}>
        <h3 className={styles.sectionTitle}>Textos da seção</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Título</label>
          <input
            className={styles.input}
            value={config.titulo}
            onChange={(e) => atualizarCampo("titulo", e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Subtítulo</label>
          <textarea
            className={styles.textarea}
            value={config.subtitulo}
            onChange={(e) => atualizarCampo("subtitulo", e.target.value)}
            rows={2}
            required
          />
        </div>
      </section>

      <section className={styles.bloco}>
        <h3 className={styles.sectionTitle}>Cards da agenda</h3>
        {config.cards.map((card, index) => (
          <fieldset className={styles.cardEditor} key={index}>
            <legend className={styles.cardLegend}>
              Card {index + 1}
              <span className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => moverCard(index, -1)}
                  disabled={index === 0}
                  title="Mover para cima"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => moverCard(index, 1)}
                  disabled={index === config.cards.length - 1}
                  title="Mover para baixo"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => removerCard(index)}
                  title="Remover card"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </legend>

            <div className={styles.cardGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dia (destaque)</label>
                <input
                  className={styles.input}
                  value={card.dia}
                  onChange={(e) => atualizarCard(index, "dia", e.target.value)}
                  placeholder="Sex"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Complemento do dia</label>
                <input
                  className={styles.input}
                  value={card.detalhe}
                  onChange={(e) =>
                    atualizarCard(index, "detalhe", e.target.value)
                  }
                  placeholder="& sáb"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Título</label>
                <input
                  className={styles.input}
                  value={card.titulo}
                  onChange={(e) =>
                    atualizarCard(index, "titulo", e.target.value)
                  }
                  placeholder="Café das Maids"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pill (etiqueta)</label>
                <input
                  className={styles.input}
                  value={card.pill}
                  onChange={(e) => atualizarCard(index, "pill", e.target.value)}
                  placeholder="Toda semana"
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.spanFull}`}>
                <label className={styles.label}>Descrição</label>
                <input
                  className={styles.input}
                  value={card.descricao}
                  onChange={(e) =>
                    atualizarCard(index, "descricao", e.target.value)
                  }
                  placeholder="Performances, dancinhas e fotos com a equipe."
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.spanFull}`}>
                <label className={styles.label}>Link do card</label>
                <input
                  className={styles.input}
                  value={card.link}
                  onChange={(e) => atualizarCard(index, "link", e.target.value)}
                  placeholder="/eventos"
                  required
                />
              </div>
            </div>
          </fieldset>
        ))}

        <button
          type="button"
          className={styles.addBtn}
          onClick={adicionarCard}
        >
          <Plus size={16} /> Adicionar card
        </button>
      </section>

      <section className={styles.bloco}>
        <h3 className={styles.sectionTitle}>Botões da seção</h3>
        <div className={styles.cardGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Botão principal — texto</label>
            <input
              className={styles.input}
              value={config.ctaPrimarioTexto}
              onChange={(e) =>
                atualizarCampo("ctaPrimarioTexto", e.target.value)
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Botão principal — link</label>
            <input
              className={styles.input}
              value={config.ctaPrimarioLink}
              onChange={(e) =>
                atualizarCampo("ctaPrimarioLink", e.target.value)
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Botão secundário — texto</label>
            <input
              className={styles.input}
              value={config.ctaSecundarioTexto}
              onChange={(e) =>
                atualizarCampo("ctaSecundarioTexto", e.target.value)
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Botão secundário — link</label>
            <input
              className={styles.input}
              value={config.ctaSecundarioLink}
              onChange={(e) =>
                atualizarCampo("ctaSecundarioLink", e.target.value)
              }
              required
            />
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={restaurarPadrao}
        >
          <RotateCcw size={16} /> Restaurar padrão
        </button>
        <button
          type="submit"
          className={styles.saveBtn}
          disabled={mutationSalvar.isPending}
        >
          <Save size={16} />{" "}
          {mutationSalvar.isPending ? "Salvando..." : "Salvar seção"}
        </button>
      </div>
    </form>
  );
}
