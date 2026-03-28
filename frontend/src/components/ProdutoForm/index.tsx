import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, X } from "lucide-react";
import styles from "./style.module.css";
import type { Produto } from "../../types/Produto";

interface ProdutoFormProps {
  produtoEditando: Produto | null;
  onCancel: () => void;
  onSave: (formData: FormData) => Promise<void>;
  isStoreTab: boolean;
}

export function ProdutoForm({
  produtoEditando,
  onCancel,
  onSave,
  isStoreTab,
}: ProdutoFormProps) {
  // Estados locais (agora só existem aqui dentro!)
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [precoOriginal, setPrecoOriginal] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tags, setTags] = useState("");
  const [promocao, setPromocao] = useState(false);
  const [visivel, setVisivel] = useState(true);
  const [imagem, setImagem] = useState<File | null>(null);

  function resetForm() {
    setNome("");
    setDescricao("");
    setPreco("");
    setPrecoOriginal("");
    setCategoria("");
    setTags("");
    setPromocao(false);
    setVisivel(true);
    setImagem(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  // Popula o form quando entra em modo edição
  useEffect(() => {
    if (produtoEditando) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNome(produtoEditando.nome);
      setDescricao(produtoEditando.descricao || "");
      setPreco(String(produtoEditando.preco));
      setPrecoOriginal(produtoEditando.preco_original ? String(produtoEditando.preco_original) : "");
      setCategoria(produtoEditando.categoria);
      setTags(produtoEditando.tags || "");
      setPromocao(produtoEditando.promocao);
      setVisivel(produtoEditando.visivel ?? true);
    } else {
      resetForm();
    }
  }, [produtoEditando]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    if (precoOriginal) formData.append("preco_original", precoOriginal);
    formData.append("categoria", categoria);
    formData.append("tags", tags);
    formData.append("promocao", String(promocao));
    formData.append("visivel", String(visivel));
    formData.append("is_loja", String(isStoreTab));
    if (imagem) formData.append("imagem", imagem);

    await onSave(formData);
    if (!produtoEditando) resetForm(); // Limpa só se for criação
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {produtoEditando ? `Editando: ${nome}` : "Adicionar Novo Item"}
      </h2>

      {/* Hardcoded placeholder style as requested */}
      <style>{`
        .local-input::placeholder {
          color: #9ca3af !important;
          -webkit-text-fill-color: #9ca3af !important;
          opacity: 1 !important;
        }
      `}</style>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <input
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`${styles.input} local-input`}
          required
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />
        <input
          placeholder="Categoria (ex: Bebidas, Bolos)"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className={`${styles.input} local-input`}
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />
        <input
          placeholder="Tags (separadas por vírgula, ex: Vegano, Sem Glúten)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={`${styles.input} local-input`}
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />
        <input
          placeholder="Preço (ex: 15.90)"
          type="number"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
          className={`${styles.input} local-input`}
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />
        <input
          placeholder="Preço Original (Opcional, ex: 25.90)"
          type="number"
          step="0.01"
          value={precoOriginal}
          onChange={(e) => setPrecoOriginal(e.target.value)}
          className={`${styles.input} local-input`}
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />

        <div className={styles.checkboxContainer} style={{ display: 'flex', gap: '1rem' }}>
          <div>
            <input
              type="checkbox"
              id="promocao"
              checked={promocao}
              onChange={(e) => setPromocao(e.target.checked)}
            />
            <label htmlFor="promocao" className={styles.checkboxLabel} style={{ marginLeft: '4px' }}>
              Promoção
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="visivel"
              checked={visivel}
              onChange={(e) => setVisivel(e.target.checked)}
            />
            <label htmlFor="visivel" className={styles.checkboxLabel} style={{ marginLeft: '4px' }}>
              Exibir ao Público
            </label>
          </div>
        </div>

        <textarea
          placeholder="Descrição detalhada..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={`${styles.input} ${styles.textarea} local-input`}
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
            WebkitTextFillColor: "#000000",
          }}
        />

        <div className={styles.fileInputContainer}>
          <label className={styles.fileLabel}>
            Foto do Produto{" "}
            {produtoEditando && "(Deixe vazio para manter a atual)"}:
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImagem(e.target.files ? e.target.files[0] : null)
            }
            required={!produtoEditando}
            className={styles.fileInput}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnSubmit} ${
              produtoEditando ? styles.edit : styles.create
            }`}
          >
            {produtoEditando ? (
              <>
                <Edit size={18} /> Salvar
              </>
            ) : (
              <>
                <Plus size={18} /> Cadastrar
              </>
            )}
          </button>

          {produtoEditando && (
            <button
              type="button"
              onClick={onCancel}
              className={`${styles.btn} ${styles.btnCancel}`}
            >
              <X size={18} /> Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
