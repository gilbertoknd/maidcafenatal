import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Eye, EyeOff, Loader2 } from "lucide-react";
import { buscarConfiguracoes, atualizarConfiguracoes } from "../../services/api";
import type { SecaoHomeChave } from "../../types/Configuracao";
import { SECOES_HOME_ORDEM, SECOES_HOME_LABELS } from "../../types/Configuracao";
import styles from "./styles.module.css";

/**
 * Painel administrativo para ocultar/exibir seções da homepage.
 * Cada seção é representada por um checkbox (toggle) que persiste
 * na tabela `configuracoes` do banco via API.
 */
export function AdminSecoesHome() {
  const queryClient = useQueryClient();
  const [salvando, setSalvando] = useState<SecaoHomeChave | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 1000 * 60 * 5,
  });

  // Monta o estado de visibilidade a partir das configurações
  function isSecaoVisivel(chave: SecaoHomeChave): boolean {
    if (!data?.configuracoes) return true;
    const valor = data.configuracoes[chave];
    if (valor === undefined) return true;
    return valor !== "false";
  }

  async function handleToggle(chave: SecaoHomeChave) {
    const novoValor = isSecaoVisivel(chave) ? "false" : "true";
    setSalvando(chave);
    setMensagem(null);

    try {
      await atualizarConfiguracoes({ [chave]: novoValor });
      // Invalida o cache para refletir a mudança
      await queryClient.invalidateQueries({ queryKey: ["configuracoes"] });

      const label = SECOES_HOME_LABELS[chave];
      setMensagem(
        novoValor === "true"
          ? `✨ Seção "${label}" agora está visível!`
          : `🙈 Seção "${label}" foi ocultada.`
      );
    } catch {
      setMensagem("❌ Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(null);
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={24} />
        Carregando seções...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LayoutDashboard size={22} />
        <h2 className={styles.titulo}>Seções da Homepage</h2>
      </div>
      <p className={styles.descricao}>
        Controle quais seções ficam visíveis na página inicial do site.
        Desmarque para ocultar uma seção.
      </p>

      <div className={styles.lista}>
        {SECOES_HOME_ORDEM.map((chave) => {
          const visivel = isSecaoVisivel(chave);
          const carregando = salvando === chave;

          return (
            <label
              key={chave}
              className={`${styles.item} ${!visivel ? styles.itemOculto : ""}`}
            >
              <div className={styles.itemInfo}>
                {visivel ? (
                  <Eye size={18} className={styles.iconVisivel} />
                ) : (
                  <EyeOff size={18} className={styles.iconOculto} />
                )}
                <span className={styles.itemLabel}>
                  {SECOES_HOME_LABELS[chave]}
                </span>
              </div>

              <div className={styles.toggleWrapper}>
                {carregando && (
                  <Loader2 size={14} className={styles.spinnerMini} />
                )}
                <input
                  type="checkbox"
                  checked={visivel}
                  onChange={() => handleToggle(chave)}
                  disabled={carregando}
                  className={styles.checkbox}
                  aria-label={SECOES_HOME_LABELS[chave]}
                />
              </div>
            </label>
          );
        })}
      </div>

      {mensagem && (
        <div
          className={`${styles.toast} ${
            mensagem.startsWith("❌") ? styles.toastErro : styles.toastSucesso
          }`}
        >
          {mensagem}
        </div>
      )}
    </div>
  );
}
