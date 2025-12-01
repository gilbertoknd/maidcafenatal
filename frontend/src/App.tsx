import { useEffect, useState } from "react";
import { ProductCard } from "./components/ProductCard";
import type { Produto } from "./types";

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    fetch(`${apiUrl}/api/produtos`)
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ color: "#e91e63", fontSize: "2.5rem" }}>
          🌸 Cardápio Mew Mew 🌸
        </h1>
      </header>

      {loading ? (
        <p style={{ textAlign: "center" }}>Carregando refeições...</p>
      ) : (
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
            justifyItems: "center",
          }}
        >
          {/*Mapeia a lista e cria um card pra cada produto*/}
          {produtos.map((produto) => (
            <ProductCard key={produto.id} data={produto} />
          ))}
        </main>
      )}
    </div>
  );
}

export default App;
