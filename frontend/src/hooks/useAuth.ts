import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  async function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  //Helper para verificar resposta 401 em requisições
  function verifyTokenExpiration(res: Response) {
    if (res.status === 401) {
      alert("Sessão expirada. Faça login novamente.");
      logout();
      return false; //Token inválido
    }
    return true; //Token ok
  }

  useEffect(() => {
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
