import { useParams, useNavigate } from "react-router-dom";

import { useProdutos } from "../../hooks/useProdutos";
import { useCarrinho } from "../../hooks/useCarrinho";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { formatCurrency } from "../../utils/formatadores";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export function ProdutoDetalhesLoja() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { produtos, loading } = useProdutos("store");
  const { adicionarProduto } = useCarrinho();
  
  const produto = produtos.length > 0 ? produtos.find(p => p.id === Number(id)) || null : null;

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Carregando produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!produto) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <h2>Produto não encontrado</h2>
          <button 
            onClick={() => navigate('/loja')}
            style={{ padding: '0.5rem 1rem', background: '#ff69b4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Voltar para a Loja
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const fullImageUrl = `${backendUrl}${produto.imagem_url}`;
  const precoFormatado = formatCurrency(produto.preco);
  const tagsArray = produto.tags 
    ? produto.tags.split(",").map((tag: string) => tag.trim()).filter((t: string) => t.length > 0)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={() => navigate('/loja')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#ff69b4', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={20} /> Voltar para a Loja
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Layout Responsivo será tratado por media queries ou flexwrap. Usaremos um flex responsivo via inline styles básico. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <img
                src={fullImageUrl}
                alt={produto.nome}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', aspectRatio: '1/1' }}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=Sem+Foto";
                }}
              />
            </div>

            <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '0.5rem' }}>{produto.nome}</h1>
                
                {tagsArray.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {tagsArray.map((tag: string, idx: number) => (
                      <span key={idx} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ffd1dc', color: '#ff1493', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                 {produto.preco_original && (
                  <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1rem' }}>
                    {formatCurrency(produto.preco_original)}
                  </span>
                )}
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff69b4' }}>
                  {precoFormatado}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#555', marginBottom: '0.5rem' }}>Descrição</h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>
                  {produto.descricao || "Sem descrição disponível para este produto."}
                </p>
              </div>

              <button
                onClick={() => adicionarProduto(produto)}
                style={{ 
                  marginTop: 'auto',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#ff69b4', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff1493'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff69b4'}
              >
                <ShoppingCart size={24} />
                Adicionar ao Carrinho
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
