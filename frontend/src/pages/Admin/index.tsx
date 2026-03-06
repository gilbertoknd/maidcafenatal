import { useEffect, useState } from "react";
import LoginModal from "../../components/LoginModal";
import AdminDashboard from "../../components/AdminDashboard";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    // Optionally listen to changes if needed, but initial read is done in useState
  }, []);

  //Se não estiver logado: Mostra o Login
  if (!isAuthenticated) {
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  //Se estiver logado: Mostra o Painel Completo (Dashboard)
  return (
    <div style={{ padding: 20 }}>
      <AdminDashboard />
    </div>
  );
}
