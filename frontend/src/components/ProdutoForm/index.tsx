import { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, X } from "lucide-react";
import styles from "./style.module.css";
import type { Produto } from "../../types/Produto";
import { useProdutos } from "../../hooks/useProdutos";

interface ProdutoFormProps {
  produtoEditando: Produto | null;
  onCancel: () => void;
  onSave: (formData: FormData) => Promise<void>;
  productType: "menu" | "store" | "mangas";
}

export function ProdutoForm({
  produtoEditando,
  onCancel,
  onSave,
  productType,
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

  // --- LÓGICA DE AUTOCOMPLETE ---
  const productData = useProdutos(productType, true);
  const existingProducts = productData.produtos || [];

  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleTagSelect = (tag: string) => {
    const segments = tags.split(",").map((t) => t.trim());
    segments.pop();
    if (segments.length > 0 && segments[0] !== "") {
      setTags([...segments, tag].join(", ") + ", ");
    } else {
      setTags(tag + ", ");
    }
    setShowTagDropdown(false);
  };

  // Memorizar cálculos para performance e estabilidade
  const existingCategories = useMemo(() => {
    return Array.from(
      new Set(
        existingProducts.map((p: Produto) => p.categoria).filter(Boolean),
      ),
    );
  }, [existingProducts]);

  const existingTags = useMemo(() => {
    const tagsSet = new Set<string>();
    existingProducts.forEach((p: Produto) => {
      if (p.tags) {
        p.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
          .forEach((t: string) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [existingProducts]);

  const filteredCategories = useMemo(() => {
    return existingCategories.filter(
      (c) =>
        String(c).toLowerCase().includes(categoria.toLowerCase()) &&
        String(c) !== categoria,
    );
  }, [existingCategories, categoria]);

  const filteredTags = useMemo(() => {
    const currentTagsSegments = tags.split(",").map((t) => t.trim());
    const currentTagSearch =
      currentTagsSegments[currentTagsSegments.length - 1] || "";
    return existingTags.filter(
      (t) =>
        t.toLowerCase().includes(currentTagSearch.toLowerCase()) &&
        !currentTagsSegments.includes(t),
    );
  }, [existingTags, tags]);

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
      setPrecoOriginal(
        produtoEditando.preco_original
          ? String(produtoEditando.preco_original)
          : "",
      );
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
    formData.append("is_loja", String(productType === "store"));
    formData.append("is_manga", String(productType === "mangas"));
    if (imagem) formData.append("imagem", imagem);

    await onSave(formData);
    if (!produtoEditando) resetForm(); // Limpa só se for criação
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {produtoEditando
          ? `Editando: ${nome}`
          : productType === "store"
            ? "Adicionar Novo Item a Loja 🛍️"
            : productType === "mangas"
              ? "Adicionar Novo Mangá 📚"
              : "Adicionar Novo Item ao Cardápio 🍰"}
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
        <div className={styles.autocompleteContainer}>
          <input
            placeholder="Categoria (ex: Bebidas, Bolos)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            onFocus={() => setShowCatDropdown(true)}
            onBlur={() => setTimeout(() => setShowCatDropdown(false), 200)}
            required
            className={`${styles.input} local-input`}
            style={{
              color: "#000000",
              backgroundColor: "#ffffff",
              WebkitTextFillColor: "#000000",
            }}
            autoComplete="off"
          />
          {showCatDropdown && filteredCategories.length > 0 && (
            <ul
              className={styles.dropdownList}
              onMouseDown={(e) => e.preventDefault()} // Impede o blur do input ao clicar no scroll
            >
              {filteredCategories.map((cat, i) => (
                <li
                  key={i}
                  className={styles.dropdownItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCategoria(String(cat));
                    setShowCatDropdown(false);
                  }}
                >
                  {String(cat)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.autocompleteContainer}>
          <input
            placeholder="Tags (separadas por vírgula, ex: Vegano, Sem Glúten)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onFocus={() => setShowTagDropdown(true)}
            onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
            className={`${styles.input} local-input`}
            style={{
              color: "#000000",
              backgroundColor: "#ffffff",
              WebkitTextFillColor: "#000000",
            }}
            autoComplete="off"
          />
          {showTagDropdown && filteredTags.length > 0 && (
            <ul
              className={styles.dropdownList}
              onMouseDown={(e) => e.preventDefault()} // Impede o blur do input ao clicar no scroll
            >
              {filteredTags.map((tag, i) => (
                <li
                  key={i}
                  className={styles.dropdownItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleTagSelect(tag);
                  }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
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

        <div
          className={styles.checkboxContainer}
          style={{ display: "flex", gap: "1rem" }}
        >
          <div>
            <input
              type="checkbox"
              id="promocao"
              checked={promocao}
              onChange={(e) => setPromocao(e.target.checked)}
            />
            <label
              htmlFor="promocao"
              className={styles.checkboxLabel}
              style={{ marginLeft: "4px" }}
            >
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
            <label
              htmlFor="visivel"
              className={styles.checkboxLabel}
              style={{ marginLeft: "4px" }}
            >
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
