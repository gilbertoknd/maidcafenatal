import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../services/api";
import { formatCurrency } from "../../utils/formatters";
import styles from "./styles.module.css";

interface Order {
  id: number;
  cliente_nome: string;
  cliente_endereco: string;
  total: number;
  status: string;
  criado_em: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status do pedido.");
    }
  };

  const statusColors: Record<string, string> = {
    "Pendente Whatsapp": "#f39c12", // Laranja
    "Em Preparo": "#3498db", // Azul
    "Saiu para entrega": "#9b59b6", // Roxo
    "Entregue": "#2ecc71", // Verde
    "Cancelado": "#e74c3c", // Vermelho
  };

  if (isLoading) return <div className={styles.loading}>Carregando pedidos... 📦</div>;

  return (
    <div className={styles.ordersContainer}>
      <h2>Gerenciamento de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p className={styles.emptyMsg}>Nenhum pedido recebido ainda.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3>Pedido #{order.id}</h3>
                <span className={styles.date}>
                  {new Date(order.criado_em).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              
              <div className={styles.orderDetails}>
                <p><strong>Cliente:</strong> {order.cliente_nome}</p>
                <p><strong>Endereço:</strong> {order.cliente_endereco}</p>
                <p className={styles.totalValue}><strong>Total:</strong> {formatCurrency(order.total)}</p>
              </div>

              <div className={styles.orderActions}>
                <div className={styles.statusBadge} style={{ backgroundColor: statusColors[order.status] || "#95a5a6" }}>
                  {order.status}
                </div>
                
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="Pendente Whatsapp">Pendente Whatsapp</option>
                  <option value="Em Preparo">Em Preparo</option>
                  <option value="Saiu para entrega">Saiu para entrega</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
