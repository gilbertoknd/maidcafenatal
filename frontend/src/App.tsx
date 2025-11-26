import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [statusBackend, setStatusBackend] = useState<string>("Carregando...");

  useEffect(() => {
    //Busca a URL do .env
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    //Tenta bater na raiz do backend
    fetch(`${apiUrl}/`)
      .then((res) => res.json())
      .then((data) => {
        setStatusBackend(`Success: "${data.mensagem}"`);
      })
      .catch((erro) => {
        console.error(erro);
        setStatusBackend("Error: API Connection failed");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Mew Mew Maid Cafe</h1>
      <div
        style={{
          backgroundColor: statusBackend.includes("Success")
            ? "#d4edda"
            : "#f8d7da",
        }}
      >
        <strong>Status do Backend:</strong> {statusBackend}
      </div>
    </div>
  );
}

export default App;
