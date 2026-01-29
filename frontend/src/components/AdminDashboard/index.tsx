import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import styles from "./style.module.css";
//Componentes
import LoginModal from "../LoginModal";
import { ProductCard } from "../ProductCard";
import { ProductForm } from "../ProductForm/index";
//Hooks e Types
import { useAuth } from "../../hooks/useAuth";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import type { Produto } from "../../types/produto";

export default function AdminDashboard() {
  //1. Hook de Auth
  const {
    isAuthenticated,
    setIsAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuth();

  //2. Hook de Produtos (Manuseia o CRUD)
  const {
    produtos,
    loading: productsLoading,
    fetchProducts,
    saveProduct,
    deleteProduct,
  } = useAdminProducts();

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  //Busca produtos ao logar
  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated, fetchProducts]);

  //Função wrapper para salvar
  async function handleSaveWrapper(formData: FormData) {
    const success = await saveProduct(
      formData,
      !!produtoEditando,
      produtoEditando?.id,
    );
    if (success) setProdutoEditando(null); //Fecha o form se deu certo
  }

  //--- RENDERIZAÇÃO ---

  if (authLoading)
    return <div className={styles.loading}>Verificando... 🔐</div>;

  if (!isAuthenticated)
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Painel Administrativo 🍰</h1>
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sair
        </button>
      </div>

      {/* Formulário Wrapper */}
      <ProductForm
        produtoEditando={produtoEditando}
        onSave={handleSaveWrapper}
        onCancel={() => setProdutoEditando(null)}
      />

      <h2 className={styles.listTitle}>
        Cardápio Atual ({produtos.length})
        {productsLoading && <span style={{ fontSize: "0.8em" }}> 🔄</span>}
      </h2>

      <div className={styles.listGrid}>
        {produtos.map((prod) => (
          <ProductCard
            key={prod.id}
            data={prod}
            onEdit={setProdutoEditando}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    </div>
  );
}
