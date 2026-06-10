import { useParams, useNavigate } from "react-router-dom";

import { useProdutos } from "../../hooks/useProdutos";
import { useCarrinho } from "../../hooks/useCarrinho";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { formatCurrency } from "../../utils/formatadores";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import styles from "./styles.module.css";

export function ProdutoDetalhesLoja() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { produtos, loading } = useProdutos("store");
  const { adicionarProduto } = useCarrinho();

  const produto =
    produtos.length > 0
      ? produtos.find((p) => p.id === Number(id)) || null
      : null;

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.centerBox}>
          <p>Carregando produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!produto) {
    return (
      <>
        <Header />
        <div className={styles.centerBox}>
          <h2>Produto não encontrado</h2>
          <button onClick={() => navigate("/loja")} className={styles.backBtn}>
            Voltar para a Loja
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${produto.imagem_url}`;
  const precoFormatado = formatCurrency(produto.preco);
  const tagsArray = produto.tags
    ? produto.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((t: string) => t.length > 0)
    : [];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <button onClick={() => navigate("/loja")} className={styles.backBtn}>
          <ArrowLeft size={20} /> Voltar para a Loja
        </button>

        <div className={styles.detailsCard}>
          <div className={styles.imageColumn}>
            <img
              src={fullImageUrl}
              alt={produto.nome}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400?text=Sem+Foto";
              }}
            />
          </div>

          <div className={styles.infoColumn}>
            <div>
              <h1 className={styles.title}>{produto.nome}</h1>

              {tagsArray.length > 0 && (
                <div className={styles.tags}>
                  {tagsArray.map((tag: string, idx: number) => (
                    <span key={idx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.priceBox}>
              {produto.preco_original && (
                <span className={styles.originalPrice}>
                  {formatCurrency(produto.preco_original)}
                </span>
              )}
              <span className={styles.price}>{precoFormatado}</span>
            </div>

            <div>
              <h3 className={styles.sectionLabel}>Descrição</h3>
              <p className={styles.description}>
                {produto.descricao ||
                  "Sem descrição disponível para este produto."}
              </p>
            </div>

            <button
              onClick={() => adicionarProduto(produto)}
              className={styles.addBtn}
            >
              <ShoppingCart size={24} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
