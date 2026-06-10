import { useState, useEffect } from "react";
import {
  LogOut,
  ClipboardList,
  TicketPercent,
  UtensilsCrossed,
  ShoppingBag,
  BookOpenText,
  CalendarDays,
  Image,
  Instagram,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./styles.module.css";
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

type AdminTab =
  | "produtos"
  | "loja"
  | "mangas"
  | "pedidos"
  | "eventos"
  | "banners"
  | "fontes"
  | "instagram"
  | "cupons";

interface TabItem {
  id: AdminTab;
  label: string;
  icone: LucideIcon;
}

interface TabGroup {
  titulo: string;
  itens: TabItem[];
}

/** Abas do painel agrupadas por área de trabalho. */
const gruposDeTabs: TabGroup[] = [
  {
    titulo: "Operação",
    itens: [
      { id: "pedidos", label: "Pedidos", icone: ClipboardList },
      { id: "cupons", label: "Cupons", icone: TicketPercent },
    ],
  },
  {
    titulo: "Catálogo",
    itens: [
      { id: "produtos", label: "Cardápio", icone: UtensilsCrossed },
      { id: "loja", label: "Loja", icone: ShoppingBag },
      { id: "mangas", label: "Mangás", icone: BookOpenText },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { id: "eventos", label: "Eventos", icone: CalendarDays },
      { id: "banners", label: "Banners", icone: Image },
      { id: "instagram", label: "Instagram", icone: Instagram },
    ],
  },
  {
    titulo: "Aparência",
    itens: [{ id: "fontes", label: "Fontes", icone: Type }],
  },
];

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
  const [activeTab, setActiveTab] = useState<AdminTab>("pedidos");

  const { refresh: refreshMenu } = menuProductData;
  const { refresh: refreshStore } = storeProductData;
  const { refresh: refreshMangas } = mangasProductData;

  // Troca de aba limpando o form de edição (event-driven, sem setState em effect)
  function handleTabChange(tab: AdminTab) {
    setProdutoEditando(null);
    setActiveTab(tab);
  }

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
        <div className={styles.brand}>
          <img
            src="/wordmark-cardinal.png"
            alt="Mew Mew Café"
            className={styles.brandLogo}
          />
          <span className={styles.brandLabel}>Painel Admin</span>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className={styles.adminBody}>
        <aside className={styles.sidebar}>
          {gruposDeTabs.map((grupo) => (
            <nav className={styles.tabGroup} key={grupo.titulo}>
              <span className={styles.tabGroupTitle}>{grupo.titulo}</span>
              {grupo.itens.map(({ id, label, icone: Icone }) => (
                <button
                  key={id}
                  className={`${styles.tabBtn} ${
                    activeTab === id ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange(id)}
                >
                  <Icone size={17} /> {label}
                </button>
              ))}
            </nav>
          ))}
        </aside>

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
    </div>
  );
}
