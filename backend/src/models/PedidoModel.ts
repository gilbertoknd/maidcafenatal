import { pool } from "../config/db.js";

export interface ItemPedido {
  produto_id: number;
  quantidade: number;
}

export interface Pedido {
  id?: number;
  cliente_nome: string;
  cliente_endereco: string;
  total: number;
  status?: string;
  criado_em?: Date;
  itens?: ItemPedido[];
}

export const PedidoModel = {
  // Cria novo pedido e seus itens em uma transação
  criarPedido: async (
    cliente_nome: string,
    cliente_endereco: string,
    itens: ItemPedido[],
  ): Promise<Pedido> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Calcula o total usando os preços do banco de dados
      let total = 0;
      const itensComPreco = [];

      for (const item of itens) {
        const result = await client.query(
          "SELECT preco FROM produtos WHERE id = $1",
          [item.produto_id],
        );

        if (result.rows.length === 0) {
          throw new Error(`Produto com ID ${item.produto_id} não encontrado`);
        }

        const precoUnitario = parseFloat(result.rows[0].preco);
        total += precoUnitario * item.quantidade;

        itensComPreco.push({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: precoUnitario,
        });
      }

      // Insere o pedido
      const orderResult = await client.query(
        "INSERT INTO pedidos (cliente_nome, cliente_endereco, total) VALUES ($1, $2, $3) RETURNING *",
        [cliente_nome, cliente_endereco, total],
      );
      const newOrder = orderResult.rows[0];

      // Insere os itens
      for (const item of itensComPreco) {
        await client.query(
          "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)",
          [newOrder.id, item.produto_id, item.quantidade, item.preco_unitario],
        );
      }

      await client.query("COMMIT");
      return newOrder;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  listarTodos: async (): Promise<any[]> => {
    const result = await pool.query(
      "SELECT * FROM pedidos ORDER BY criado_em DESC",
    );
    return result.rows;
  },

  buscarItensPedido: async (pedidoId: number): Promise<any[]> => {
    const result = await pool.query(
      `SELECT ip.quantidade, ip.preco_unitario, p.nome, p.imagem_url 
       FROM itens_pedido ip 
       JOIN produtos p ON ip.produto_id = p.id 
       WHERE ip.pedido_id = $1`,
      [pedidoId],
    );
    return result.rows;
  },

  atualizarStatus: async (id: number, status: string): Promise<Pedido | null> => {
    const result = await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );
    return result.rows[0] || null;
  },
};
