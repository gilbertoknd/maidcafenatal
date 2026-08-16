import { useState } from "react";
import styles from "./styles.module.css";

interface LoginModalProps {
  onSuccess: () => void;
}

export default function LoginModal({ onSuccess }: LoginModalProps) {
  const [nickname, setNickname] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); //Limpa erro anterior

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/autenticacao/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // recebe o cookie HttpOnly de sessão
          body: JSON.stringify({ nickname, senha }),
        },
      );

      if (response.ok) {
        // O token vem num cookie HttpOnly; nada é salvo no localStorage.
        onSuccess(); //Avisa o pai que deu certo
      } else {
        setErro("Credenciais incorretas");
      }
    } catch {
      setErro("Erro de conexão");
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Painel do Administrador</h2>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            placeholder="Usuário"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input}
          />

          {erro && <p className={styles.error}>{erro}</p>}

          <button type="submit" className={styles.submit}>
            Acessar Painel
          </button>
        </form>
      </div>
    </div>
  );
}
