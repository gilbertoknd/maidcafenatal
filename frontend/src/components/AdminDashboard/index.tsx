import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import styles from "./style.module.css";
//Componentes
import LoginModal from "../LoginModal";
import { ProdutoForm } from "../ProdutoForm/index";
import { MenuContent } from "../MenuContent";
import { AdminPedidos } from "../AdminPedidos";
import { AdminEventos } from "../AdminEventos";
// Hooks e Types
import { useAutenticacao } from "../../hooks/useAutenticacao";
import { useAdminProdutos } from "../../hooks/useAdminProdutos";
import { useProdutos } from "../../hooks/useProdutos";
import type { Produto } from "../../types/Produto";

export default function AdminDashboard() {
  // 1. Hook de Auth
  const {
    isAuthenticated,
    setIsAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAutenticacao();

  // 2. Hook de Produtos (Manuseia o CRUD)
  const { salvarProduto, deletarProduto, alternarVisibilidade } = useAdminProdutos();

  // 3. Hook de Produtos (Lista/Filtros) - Fonte da verdade visual
  const menuProductData = useProdutos("menu", true);
  const storeProductData = useProdutos("store", true);

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [activeTab, setActiveTab] = useState<"produtos" | "loja" | "pedidos" | "eventos" | "banners">("pedidos");

  const { refresh: refreshMenu } = menuProductData;
  const { refresh: refreshStore } = storeProductData;

  // Busca produtos ao logar
  useEffect(() => {
    if (isAuthenticated) {
      refreshMenu();
      refreshStore();
    }
  }, [isAuthenticated, refreshMenu, refreshStore]);

  // Função wrapper para salvar
  async function handleSaveWrapper(formData: FormData) {
    const success = await salvarProduto(
      formData,
      !!produtoEditando,
      produtoEditando?.id,
    );
    if (success) {
      setProdutoEditando(null); // Fecha o form se deu certo
      menuProductData.refresh(); // Atualiza a lista menu
      storeProductData.refresh(); // Atualiza a lista loja
    }
  }

  // Função wrapper para deletar
  async function handleDeleteWrapper(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    const success = await deletarProduto(id);
    if (success) {
      menuProductData.refresh();
      storeProductData.refresh();
    }
  }

  // Função wrapper para alternar visibilidade
  async function handleToggleVisibilityWrapper(id: number) {
    const success = await alternarVisibilidade(id);
    if (success) {
      menuProductData.refresh();
      storeProductData.refresh();
    }
  }

  // --- RENDERIZAÇÃO ---

  if (authLoading) return <div className={styles.loading}>Verificando... 🔐</div>;

  if (!isAuthenticated) return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary-dark)", fontWeight: "bold" }}>
          <img src={"/Logo.svg"} alt="Logo" style={{ height: "40px" }} />
          <span>Admin</span>
        </div>
        <nav className={styles.tabsContainer}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "banners" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("banners")}
          >
            Banners
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "pedidos" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("pedidos")}
          >
            Pedidos
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "produtos" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("produtos")}
          >
            Cardápio
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "loja" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("loja")}
          >
            Loja
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "eventos" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("eventos")}
          >
            Eventos
          </button>
        </nav>
        
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      <main className={styles.adminMain}>
        {activeTab === "pedidos" && <AdminPedidos />}
        {activeTab === "banners" && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text)" }}>
            <h2>Em Breve</h2>
            <p>Gerenciamento de banners da página inicial.</p>
          </div>
        )}
        {activeTab === "produtos" && (
          <MenuContent
            {...menuProductData}
            title="Painel Administrativo - Cardápio 🍰"
            onEdit={setProdutoEditando}
            onDelete={handleDeleteWrapper}
            onToggleVisibility={handleToggleVisibilityWrapper}
          >
            <ProdutoForm
              produtoEditando={produtoEditando}
              onSave={handleSaveWrapper}
              onCancel={() => setProdutoEditando(null)}
              isStoreTab={false}
            />
          </MenuContent>
        )}
        {activeTab === "loja" && (
          <MenuContent
            {...storeProductData}
            title="Painel Administrativo - Loja Online 🛍️"
            onEdit={setProdutoEditando}
            onDelete={handleDeleteWrapper}
            onToggleVisibility={handleToggleVisibilityWrapper}
          >
            <ProdutoForm
              produtoEditando={produtoEditando}
              onSave={handleSaveWrapper}
              onCancel={() => setProdutoEditando(null)}
              isStoreTab={true}
            />
          </MenuContent>
        )}
        {activeTab === "eventos" && <AdminEventos />}
      </main>
    </div>
  );
}
