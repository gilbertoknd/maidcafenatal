import { useState } from "react";
import { useCarrinho } from "../../hooks/useCarrinho";
import { formatCurrency } from "../../utils/formatadores";
import { X, Plus, Minus, Trash2, MapPin } from "lucide-react";
import styles from "./styles.module.css";
import { enviarPedido } from "../../services/api"; 
import { AddressMapModal } from "../AddressMapModal";
import type { AddressData } from "../AddressMapModal";
import { trackEvent } from "../../utils/analytics";
import { useValidarCupom } from "../../hooks/useCupons";
import type { CupomValido } from "../../types/Cupom";
import { WHATSAPP_NUMERO } from "../../utils/contato";
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
  const [formaPagamento, setFormaPagamento] = useState("Nenhum");
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map States
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [numeroComplemento, setNumeroComplemento] = useState("");

  // Coupon State
  const [codigoCupom, setCodigoCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<CupomValido | null>(null);
  const [mensagemCupom, setMensagemCupom] = useState("");
  const validarCupomMutation = useValidarCupom();

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

    if (formaPagamento === "Nenhum") {
      alert("Por favor, selecione uma forma de pagamento.");
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
        codigo_cupom: cupomAplicado ? cupomAplicado.codigo : undefined,
      });

      trackEvent("purchase", {
        currency: "BRL",
        value: Number(response.total),
        transaction_id: response.pedido_id,
        items: itens.map(item => ({
          item_id: item.id,
          item_name: item.nome,
          item_category: item.categoria,
          price: Number(item.preco),
          quantity: item.quantidade
        }))
      });

      //Format WhatsApp string
      let message = `*Olá! Gostaria de fazer o pedido #${response.pedido_id}:*\n\n`;
      itens.forEach((item) => {
        message += `${item.quantidade}x ${item.nome} (${formatCurrency(item.preco)})\n`;
      });
      message += `\n*Total:* ${formatCurrency(response.total)}\n`;
      if (cupomAplicado) {
        message += `*Cupom Aplicado:* ${cupomAplicado.codigo} (-${cupomAplicado.tipo_desconto === "percentual" ? cupomAplicado.valor_desconto + "%" : formatCurrency(cupomAplicado.valor_desconto)})\n`;
      }
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

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(message)}`;

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

  const handleAplicarCupom = () => {
    if (!codigoCupom.trim()) return;
    setMensagemCupom("");
    validarCupomMutation.mutate(codigoCupom, {
      onSuccess: (data) => {
        setCupomAplicado(data);
        setMensagemCupom("Cupom aplicado com sucesso!");
      },
      onError: (error: Error) => {
        setCupomAplicado(null);
        setMensagemCupom(error.message || "Cupom inválido");
      }
    });
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCodigoCupom("");
    setMensagemCupom("");
  };

  let totalFinal = total;
  if (cupomAplicado) {
    const valorDesc = parseFloat(cupomAplicado.valor_desconto);
    if (cupomAplicado.tipo_desconto === "percentual") {
      totalFinal = total - (total * (valorDesc / 100));
    } else {
      totalFinal = total - valorDesc;
    }
    if (totalFinal < 0) totalFinal = 0;
  }

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
                <span>Subtotal:</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              
              {cupomAplicado && (
                <div className={styles.totalRow} style={{ color: "var(--color-primary)" }}>
                  <span>Desconto ({cupomAplicado.codigo}):</span>
                  <strong>
                    -{cupomAplicado.tipo_desconto === "percentual" 
                      ? `${cupomAplicado.valor_desconto}%` 
                      : formatCurrency(cupomAplicado.valor_desconto)}
                  </strong>
                </div>
              )}

              <div className={styles.totalRow} style={{ fontSize: "1.2rem", marginTop: "8px" }}>
                <span>Total Final:</span>
                <strong>{formatCurrency(totalFinal)}</strong>
              </div>

              <div className={styles.couponSection}>
                {!cupomAplicado ? (
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      value={codigoCupom}
                      onChange={(e) => setCodigoCupom(e.target.value.toUpperCase())}
                      className={styles.input}
                      style={{ margin: 0 }}
                    />
                    <button 
                      type="button" 
                      onClick={handleAplicarCupom}
                      className={styles.finishBtn}
                      style={{ width: "auto", padding: "0 16px", margin: 0, backgroundColor: "#475569" }}
                      disabled={validarCupomMutation.isPending}
                    >
                      {validarCupomMutation.isPending ? "..." : "Aplicar"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0fdf4", padding: "8px 12px", borderRadius: "8px", marginTop: "16px", border: "1px solid #bbf7d0" }}>
                    <span style={{ color: "#166534", fontWeight: 600, fontSize: "0.9rem" }}>
                      Cupom {cupomAplicado.codigo} aplicado!
                    </span>
                    <button type="button" onClick={removerCupom} style={{ background: "transparent", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <X size={16} />
                    </button>
                  </div>
                )}
                {mensagemCupom && !cupomAplicado && (
                  <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px" }}>{mensagemCupom}</p>
                )}
              </div>

              <form onSubmit={handleCheckout} className={styles.checkoutForm} style={{ marginTop: "16px" }}>
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
                  <option value="Nenhum">Não selecionado</option>
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
