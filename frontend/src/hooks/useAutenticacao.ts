import { useState, useEffect } from "react";
import { verificarToken, logout as logoutRequest } from "../services/api";

export const useAutenticacao = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function logout() {
    // Limpa o cookie HttpOnly no backend (o JS não consegue apagá-lo sozinho).
    try {
      await logoutRequest();
    } finally {
      setIsAuthenticated(false);
    }
  }

  //Helper para verificar resposta 401 em requisições
  function verifyTokenExpiration(res: Response) {
    if (res.status === 401) {
      alert("Sessão expirada. Faça login novamente.");
      setIsAuthenticated(false);
      return false; //Sessão inválida
    }
    return true; //Sessão ok
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        // A verificação é feita no servidor: ele lê o cookie HttpOnly.
        const ok = await verificarToken();
        setIsAuthenticated(ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated, //Exportamos caso precise setar manual (ex: após login)
    isLoading,
    logout,
    verifyTokenExpiration,
  };
}
