import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Produto } from "../types/Produto";

export interface CarrinhoItem extends Produto {
  quantidade: number;
}

interface CarrinhoContextType {
  itens: CarrinhoItem[];
  adicionarProduto: (produto: Produto) => void;
  removerProduto: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  total: number;
  contagemItens: number;
  estaAberto: boolean;
  setEstaAberto: (aberto: boolean) => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [estaAberto, setEstaAberto] = useState(false);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) {
      setItens(JSON.parse(salvo));
    }
  }, []);

  // Salvar no localStorage ao mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  const adicionarProduto = (produto: Produto) => {
    setItens((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerProduto = (produtoId: number) => {
    setItens((prev) => prev.filter((item) => item.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerProduto(produtoId);
      return;
    }
    setItens((prev) =>
      prev.map((item) => (item.id === produtoId ? { ...item, quantidade } : item)),
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const total = itens.reduce(
    (acc, item) => acc + Number(item.preco) * item.quantidade,
    0,
  );
  const contagemItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarProduto,
        removerProduto,
        atualizarQuantidade,
        limparCarrinho,
        total,
        contagemItens,
        estaAberto,
        setEstaAberto,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
};
