import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import { sendOrderToBackend } from "../../services/api"; //we'll create this!

export function CartModal() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  //Fechar ao clicar fora
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setIsCartOpen(false);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !endereco.trim()) {
      alert("Por favor, preencha nome e endereço.");
      return;
    }

    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);
      const itens = cart.map((item) => ({
        produto_id: item.produto.id,
        quantidade: item.quantidade,
      }));

      //Sends order to backend
      const response = await sendOrderToBackend({
        cliente_nome: nome,
        cliente_endereco: endereco,
        itens,
      });

      //Format WhatsApp string
      let message = `*Olá! Gostaria de fazer o pedido #${response.orderId}:*\n\n`;
      cart.forEach((item) => {
        message += `${item.quantidade}x ${item.produto.nome} (${formatCurrency(item.produto.preco)})\n`;
      });
      message += `\n*Total:* ${formatCurrency(response.total)}\n`;
      message += `\n*Nome:* ${nome}`;
      message += `\n*Endereço:* ${endereco}`;
      message += `\n*Pagamento:* ${formaPagamento}`;
      if (observacao.trim()) {
        message += `\n*Observação:* ${observacao.trim()}`;
      }

      const whatsappNumber = "5584998350914"; //Replace with real number or env variable
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");

      clearCart();
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao processar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Seu Carrinho</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={styles.closeBtn}
          >
            <X size={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.produto.id} className={styles.cartItem}>
                  <img
                    src={`${backendUrl}${item.produto.imagem_url}`}
                    alt={item.produto.nome}
                    className={styles.itemImage}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100?text=Sem+Foto";
                    }}
                  />
                  <div className={styles.itemInfo}>
                    <h4>{item.produto.nome}</h4>
                    <span className={styles.itemPrice}>
                      {formatCurrency(item.produto.preco)}
                    </span>
                  </div>
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        updateQuantity(item.produto.id, item.quantidade - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.produto.id, item.quantidade + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeFromCart(item.produto.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.checkoutSection}>
              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>{formatCurrency(cartTotal)}</strong>
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
                <input
                  type="text"
                  placeholder="Seu Endereço de Entrega"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  className={styles.input}
                />
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
  );
}
