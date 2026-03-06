import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import styles from "./style.module.css";
//Componentes
import LoginModal from "../LoginModal";
import { ProductForm } from "../ProductForm/index";
import { MenuContent } from "../MenuContent";
//Hooks e Types
import { useAuth } from "../../hooks/useAuth";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useProducts } from "../../hooks/useProducts";
import type { Produto } from "../../types/Produto";

export default function AdminDashboard() {
  //1. Hook de Auth
  const {
    isAuthenticated,
    setIsAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuth();

  //2. Hook de Produtos (Manuseia o CRUD)
  const { saveProduct, deleteProduct } = useAdminProducts();

  //3. Hook de Produtos (Lista/Filtros) - Fonte da verdade visual
  const productData = useProducts();
  const { refresh } = productData;

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  //Busca produtos ao logar
  useEffect(() => {
    if (isAuthenticated) refresh();
  }, [isAuthenticated, refresh]);

  //Função wrapper para salvar
  async function handleSaveWrapper(formData: FormData) {
    const success = await saveProduct(
      formData,
      !!produtoEditando,
      produtoEditando?.id,
    );
    if (success) {
      setProdutoEditando(null); //Fecha o form se deu certo
      refresh(); //Atualiza a lista
    }
  }

  //Função wrapper para deletar
  async function handleDeleteWrapper(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    const success = await deleteProduct(id);
    if (success) refresh();
  }

  //--- RENDERIZAÇÃO ---

  if (authLoading)
    return <div className={styles.loading}>Verificando... 🔐</div>;

  if (!isAuthenticated)
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <MenuContent
      {...productData}
      title="Painel Administrativo 🍰"
      onEdit={setProdutoEditando}
      onDelete={handleDeleteWrapper}
      headerActions={
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sair
        </button>
      }
    >
      <ProductForm
        produtoEditando={produtoEditando}
        onSave={handleSaveWrapper}
        onCancel={() => setProdutoEditando(null)}
      />
    </MenuContent>
  );
}
