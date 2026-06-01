import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import styles from "./style.module.css";
//Componentes
import LoginModal from "../LoginModal";
import { ProdutoForm } from "../ProdutoForm/index";
import { MenuContent } from "../MenuContent";
import { AdminPedidos } from "../AdminPedidos";
import { AdminEventos } from "../AdminEventos";
import { AdminBanners } from "../AdminBanners";
import AdminFontes from "../AdminFontes";
import { AdminInstagram } from "../AdminInstagram";
import { AdminCupons } from "../AdminCupons";
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
  const { salvarProduto, deletarProduto, alternarVisibilidade } =
    useAdminProdutos();

  // 3. Hook de Produtos (Lista/Filtros) - Fonte da verdade visual
  const menuProductData = useProdutos("menu", true);
  const storeProductData = useProdutos("store", true);
  const mangasProductData = useProdutos("mangas", true);

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [activeTab, setActiveTab] = useState<
    "produtos" | "loja" | "mangas" | "pedidos" | "eventos" | "banners" | "fontes" | "instagram" | "cupons"
  >("pedidos");

  const { refresh: refreshMenu } = menuProductData;
  const { refresh: refreshStore } = storeProductData;
  const { refresh: refreshMangas } = mangasProductData;

  // Limpa o form de edição ao trocar de aba
  useEffect(() => {
    setProdutoEditando(null);
  }, [activeTab]);

  // Busca produtos ao logar
  useEffect(() => {
    if (isAuthenticated) {
      refreshMenu();
      refreshStore();
      refreshMangas();
    }
  }, [isAuthenticated, refreshMenu, refreshStore, refreshMangas]);

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
      mangasProductData.refresh(); // Atualiza a lista mangas
    }
  }

  // Função wrapper para deletar
  async function handleDeleteWrapper(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    const success = await deletarProduto(id);
    if (success) {
      menuProductData.refresh();
      storeProductData.refresh();
      mangasProductData.refresh();
    }
  }

  // Função wrapper para alternar visibilidade
  async function handleToggleVisibilityWrapper(id: number) {
    const success = await alternarVisibilidade(id);
    if (success) {
      menuProductData.refresh();
      storeProductData.refresh();
      mangasProductData.refresh();
    }
  }

  // --- RENDERIZAÇÃO ---

  if (authLoading)
    return <div className={styles.loading}>Verificando... 🔐</div>;

  if (!isAuthenticated)
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--color-primary-dark)",
            fontWeight: "bold",
          }}
        >
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
            className={`${styles.tabBtn} ${activeTab === "mangas" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("mangas")}
          >
            Mangás
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "eventos" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("eventos")}
          >
            Eventos
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "fontes" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("fontes")}
          >
            Fontes
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "instagram" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("instagram")}
          >
            Instagram
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "cupons" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("cupons")}
          >
            Cupons
          </button>
        </nav>

        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      <main className={styles.adminMain}>
        {activeTab === "pedidos" && <AdminPedidos />}
        {activeTab === "banners" && <AdminBanners />}
        {activeTab === "produtos" && (
          <MenuContent
            {...menuProductData}
            title=""
            onEdit={(produto) => {
              setProdutoEditando(produto);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDeleteWrapper}
            onToggleVisibility={handleToggleVisibilityWrapper}
          >
            <ProdutoForm
              produtoEditando={produtoEditando}
              onSave={handleSaveWrapper}
              onCancel={() => setProdutoEditando(null)}
              productType="menu"
            />
          </MenuContent>
        )}
        {activeTab === "loja" && (
          <MenuContent
            {...storeProductData}
            title=""
            onEdit={(produto) => {
              setProdutoEditando(produto);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDeleteWrapper}
            onToggleVisibility={handleToggleVisibilityWrapper}
            emptyMessage="nenhum item encontrado :("
          >
            <ProdutoForm
              produtoEditando={produtoEditando}
              onSave={handleSaveWrapper}
              onCancel={() => setProdutoEditando(null)}
              productType="store"
            />
          </MenuContent>
        )}
        {activeTab === "mangas" && (
          <MenuContent
            {...mangasProductData}
            title=""
            onEdit={(produto) => {
              setProdutoEditando(produto);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDeleteWrapper}
            onToggleVisibility={handleToggleVisibilityWrapper}
            emptyMessage="Nenhum mangá encontrado :("
          >
            <ProdutoForm
              produtoEditando={produtoEditando}
              onSave={handleSaveWrapper}
              onCancel={() => setProdutoEditando(null)}
              productType="mangas"
            />
          </MenuContent>
        )}
        {activeTab === "eventos" && <AdminEventos />}
        {activeTab === "fontes" && <AdminFontes />}
        {activeTab === "instagram" && <AdminInstagram />}
        {activeTab === "cupons" && <AdminCupons />}
      </main>
    </div>
  );
}
