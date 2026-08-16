import LoginModal from "../../components/LoginModal";
import AdminDashboard from "../../components/AdminDashboard";
import { useAutenticacao } from "../../hooks/useAutenticacao";

export function Admin() {
  // A sessão vive num cookie HttpOnly: o JS não lê o token, então a
  // autenticação é verificada no servidor (assíncrono) via /verify.
  const { isAuthenticated, isLoading, setIsAuthenticated } = useAutenticacao();

  //Enquanto verifica a sessão no servidor
  if (isLoading) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Verificando acesso… 🔐</p>;
  }

  //Se não estiver logado: Mostra o Login
  if (!isAuthenticated) {
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  //Se estiver logado: Mostra o Painel Completo (Dashboard)
  return <AdminDashboard />;
}
