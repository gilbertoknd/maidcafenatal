import { useState } from "react";
import { useCarrinho } from "../../hooks/useCarrinho";
import { formatCurrency } from "../../utils/formatadores";
import { X, Plus, Minus, Trash2, MapPin } from "lucide-react";
import styles from "./styles.module.css";
import { enviarPedido } from "../../services/api"; 
import { AddressMapModal } from "../AddressMapModal";
import type { AddressData } from "../AddressMapModal";

export function CartModal() {
  const {
    itens,
    estaAberto,
    setEstaAberto,
    atualizarQuantidade,
    removerProduto,
    total,
    limparCarrinho,
  } = useCarrinho();
  const [nome, setNome] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map States
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [numeroComplemento, setNumeroComplemento] = useState("");

  if (!estaAberto) return null;

  //Fechar ao clicar fora
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setEstaAberto(false);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !addressData) {
      alert("Por favor, preencha nome e selecione o endereço no mapa.");
      return;
    }

    if (itens.length === 0) return;

    try {
      setIsSubmitting(true);
      const backendItens = itens.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantidade,
      }));

      //Sends order to backend
      const response = await enviarPedido({
        cliente_nome: nome,
        cliente_endereco: addressData.address + (numeroComplemento ? `, ${numeroComplemento}` : ""),
        itens: backendItens,
      });

      //Format WhatsApp string
      let message = `*Olá! Gostaria de fazer o pedido #${response.pedido_id}:*\n\n`;
      itens.forEach((item) => {
        message += `${item.quantidade}x ${item.nome} (${formatCurrency(item.preco)})\n`;
      });
      message += `\n*Total:* ${formatCurrency(response.total)}\n`;
      message += `\n*Nome:* ${nome}`;
      message += `\n*Endereço:* ${addressData.address}`;
      if (numeroComplemento.trim()) {
        message += `\n*Número/Complemento:* ${numeroComplemento.trim()}`;
      }
      message += `\n*Pagamento:* ${formaPagamento}`;
      if (observacao.trim()) {
        message += `\n*Observação:* ${observacao.trim()}`;
      }
      
      message += `\n\n📍 *Localização GPS:* https://www.google.com/maps?q=${addressData.lat},${addressData.lng}`;

      const whatsappNumber = "5584998350914"; //Replace with real number or env variable
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");

      limparCarrinho();
      setEstaAberto(false);
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao processar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Seu Carrinho</h2>
          <button
            onClick={() => setEstaAberto(false)}
            className={styles.closeBtn}
          >
            <X size={24} />
          </button>
        </div>

        {itens.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.cartItems}>
              {itens.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={`${backendUrl}${item.imagem_url}`}
                    alt={item.nome}
                    className={styles.itemImage}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100?text=Sem+Foto";
                    }}
                  />
                  <div className={styles.itemInfo}>
                    <h4>{item.nome}</h4>
                    <span className={styles.itemPrice}>
                      {formatCurrency(item.preco)}
                    </span>
                  </div>
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.id, item.quantidade - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.id, item.quantidade + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removerProduto(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.checkoutSection}>
              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <form onSubmit={handleCheckout} className={styles.checkoutForm}>
                <input
                  type="text"
                  placeholder="Seu Nome Completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className={styles.input}
                />
                
                {/* Custom Map Input Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   {!addressData ? (
                      <button 
                        type="button" 
                        onClick={() => setIsMapOpen(true)}
                        className={styles.finishBtn}
                        style={{ backgroundColor: '#0284c7', display: 'flex', gap: '8px' }}
                      >
                         <MapPin size={20} /> Selecionar Endereço no Mapa
                      </button>
                   ) : (
                      <>
                         <div style={{ 
                            padding: '12px', 
                            backgroundColor: '#f1f5f9', 
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                         }}>
                            <div>
                               <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Endereço selecionado:</span>
                               <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{addressData.address}</p>
                            </div>
                            <button 
                               type="button"
                               onClick={() => setIsMapOpen(true)}
                               style={{ backgroundColor: 'transparent', color: '#0284c7', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                            >
                               Alterar endereço no mapa
                            </button>
                         </div>
                         <input
                            type="text"
                            placeholder="Número da Casa e Complemento (Apto, Bloco...)"
                            value={numeroComplemento}
                            onChange={(e) => setNumeroComplemento(e.target.value)}
                            required
                            className={styles.input}
                         />
                      </>
                   )}
                </div>

                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className={styles.input}
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Crédito">Crédito</option>
                  <option value="Débito">Débito</option>
                </select>
                <textarea
                  placeholder="Observação (ex: sem cebola)"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className={styles.input}
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.finishBtn}
                >
                  {isSubmitting ? "Processando..." : "Finalizar no WhatsApp"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    
      <AddressMapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onConfirm={(data) => {
            setAddressData(data);
            setIsMapOpen(false);
        }}
      />
    </>
  );
}
