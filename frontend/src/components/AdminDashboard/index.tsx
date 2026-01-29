import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, X, LogOut } from "lucide-react";
// ⚠️ CERTIFIQUE-SE QUE O CAMINHO DO LOGINMODAL ESTÁ CORRETO
import LoginModal from "../LoginModal/index";

// Interface para tipar os dados que vêm do Backend
import { ProductCard } from "../ProductCard";
import type { Produto } from "../../types/produto";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // States do Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [promocao, setPromocao] = useState(false);
  const [imagem, setImagem] = useState<File | null>(null);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  //Verifica token inicial
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false); //Parou de carregar, mostra login
        return;
      }
      try {
        //Pergunta pro backend: "Esse token ainda vale?"
        const res = await fetch(`${apiUrl}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // Token válido! Libera o acesso e busca produtos
          setIsAuthenticated(true);
          fetchProdutos();
        } else {
          // Token inválido ou expirado!
          console.log("Sessão expirada");
          localStorage.removeItem("token"); //Limpa o lixo
          setIsAuthenticated(false);
        }
      } catch (error) {
        //Erro de conexão (backend desligado, etc)
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); //Decisão tomada, para o loading
      }
    }

    checkAuth();
  }, []); //Roda apenas uma vez ao montar a tela

  //SE ESTIVER CARREGANDO, MOSTRA TELA DE ESPERA
  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8f9fa",
          color: "#666",
          fontSize: "18px",
        }}
      >
        Verificando credenciais... 🔐
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginModal
        onSuccess={() => {
          setIsAuthenticated(true);
          fetchProdutos(); // Busca os produtos assim que logar
        }}
      />
    );
  }

  //--- FUNÇÃO DE SEGURANÇA (O GUARDIÃO) ---
  //Se a resposta for 401 (Token Vencido), desloga o usuário na hora.
  function verificarAuth(res: Response) {
    if (res.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      handleLogout();
      return false; //Falhou
    }
    return true; //Passou
  }

  //2. Busca os produtos
  async function fetchProdutos() {
    try {
      const res = await fetch(`${apiUrl}/api/produtos`);
      //Não precisa verificar auth aqui porque rotas GET costumam ser públicas,
      //mas se for privada, adicione: if (!verificarAuth(res)) return;

      if (res.ok) {
        const data = await res.json();
        setProdutos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  //3. Função Unificada: CRIAR ou ATUALIZAR
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("categoria", categoria);
    formData.append("promocao", String(promocao));

    if (imagem) {
      formData.append("image", imagem);
    }

    try {
      let url = `${apiUrl}/api/produtos`;
      let method = "POST";

      if (editandoId) {
        url = `${apiUrl}/api/produtos/${editandoId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      //Protecao para atualizar/criar produtos
      if (!verificarAuth(res)) return;

      if (res.ok) {
        alert(editandoId ? "Produto atualizado!" : "Produto criado!");
        resetForm();
        fetchProdutos();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error || "Falha na operação"}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor");
    }
  }

  //Prepara formulário
  function handleEdit(produto: Produto) {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao || "");
    setPreco(String(produto.preco));
    setCategoria(produto.categoria);
    setPromocao(produto.promocao);
    setImagem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  //Deleta produto
  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja apagar este item?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      //Proteção para deletar produtos
      if (!verificarAuth(res)) return;

      if (res.ok) {
        setProdutos(produtos.filter((p) => p.id !== id));
      } else {
        alert("Erro ao deletar");
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Limpa formulário
  function resetForm() {
    setEditandoId(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setCategoria("");
    setPromocao(false);
    setImagem(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false); //Isso fará o LoginModal aparecer
  }

  //RENDERIZAÇÃO

  //Bloqueio: Se não estiver logado, mostra o LoginModal
  if (!isAuthenticated) {
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: "#d63384" }}>Painel Administrativo 🍰</h1>
        <button
          onClick={handleLogout}
          style={{
            background: "#666",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            gap: "5px",
          }}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>

      {/* Formulário */}
      <div
        style={{
          background: "#fff0f6",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#333" }}>
          {editandoId ? `Editando: ${nome}` : "Adicionar Novo Item"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            placeholder="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Categoria (ex: Bebidas, Bolos)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Preço (ex: 15.90)"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "white",
              padding: "0 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <input
              type="checkbox"
              id="promocao"
              checked={promocao}
              onChange={(e) => setPromocao(e.target.checked)}
            />
            <label htmlFor="promocao" style={{ cursor: "pointer", flex: 1 }}>
              É promoção?
            </label>
          </div>

          <textarea
            placeholder="Descrição detalhada..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ ...inputStyle, gridColumn: "span 2", minHeight: "80px" }}
          />

          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Foto do Produto{" "}
              {editandoId && "(Deixe vazio para manter a atual)"}:
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImagem(e.target.files ? e.target.files[0] : null)
              }
              required={!editandoId}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              type="submit"
              style={{
                ...btnStyle,
                background: editandoId ? "#ffc107" : "#28a745",
                color: editandoId ? "#000" : "#fff",
                flex: 1,
              }}
            >
              {editandoId ? (
                <>
                  <Edit size={18} /> Salvar Alterações
                </>
              ) : (
                <>
                  <Plus size={18} /> Cadastrar Produto
                </>
              )}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ ...btnStyle, background: "#6c757d", width: "auto" }}
              >
                <X size={18} /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Produtos */}
      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Cardápio Atual ({produtos.length})
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {produtos.map((prod) => (
          <ProductCard
            key={prod.id}
            data={prod}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
};

const btnStyle = {
  padding: "12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  color: "white",
};
