import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigation, Eye, EyeOff, Loader2 } from "lucide-react";
import { buscarConfiguracoes, atualizarConfiguracoes } from "../../services/api";
import type { NavChave } from "../../types/Configuracao";
import { NAV_PAGINAS_ORDEM, NAV_PAGINAS_LABELS } from "../../types/Configuracao";
import styles from "./styles.module.css";

/**
 * Painel administrativo para ocultar/exibir páginas na navbar.
 * Cada página é representada por um toggle que persiste
 * na tabela `configuracoes` do banco via API.
 */
export function AdminNavbar() {
  const queryClient = useQueryClient();
  const [salvando, setSalvando] = useState<NavChave | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 1000 * 60 * 5,
  });

  // Monta o estado de visibilidade a partir das configurações
  function isPaginaVisivel(chave: NavChave): boolean {
    if (!data?.configuracoes) return true;
    const valor = data.configuracoes[chave];
    if (valor === undefined) return true;
    return valor !== "false";
  }

  async function handleToggle(chave: NavChave) {
    const novoValor = isPaginaVisivel(chave) ? "false" : "true";
    setSalvando(chave);
    setMensagem(null);

    try {
      await atualizarConfiguracoes({ [chave]: novoValor });
      // Invalida o cache para refletir a mudança
      await queryClient.invalidateQueries({ queryKey: ["configuracoes"] });

      const label = NAV_PAGINAS_LABELS[chave];
      setMensagem(
        novoValor === "true"
          ? `✨ Página "${label}" agora está visível na navbar!`
          : `🙈 Página "${label}" foi ocultada da navbar.`
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
        Carregando páginas...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Navigation size={22} />
        <h2 className={styles.titulo}>Páginas da Navbar</h2>
      </div>
      <p className={styles.descricao}>
        Controle quais páginas ficam visíveis no menu de navegação do site.
        Desmarque para ocultar uma página da navbar.
      </p>

      <div className={styles.lista}>
        {NAV_PAGINAS_ORDEM.map((chave) => {
          const visivel = isPaginaVisivel(chave);
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
                  {NAV_PAGINAS_LABELS[chave]}
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
                  aria-label={NAV_PAGINAS_LABELS[chave]}
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
