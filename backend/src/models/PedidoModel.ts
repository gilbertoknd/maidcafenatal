import { pool } from "../config/db.js";
import { AppError } from "../errors/AppError.js";

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
  criar: async (
    cliente_nome: string,
    cliente_endereco: string,
    itens: ItemPedido[],
    codigo_cupom?: string
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

      // Check and apply coupon if provided
      let cupom_id = null;
      if (codigo_cupom) {
        const resCupom = await client.query(
          `SELECT c.id as cupom_id, c.codigo, c.usado, cam.tipo_desconto, cam.valor_desconto, cam.ativa, cam.validade
           FROM cupons c
           JOIN campanhas_cupom cam ON c.campanha_id = cam.id
           WHERE c.codigo = $1`,
          [codigo_cupom]
        );

        if (resCupom.rows.length === 0) {
          throw new AppError("Cupom não encontrado", 400);
        }

        const cupom = resCupom.rows[0];

        if (cupom.usado) throw new AppError("Este cupom já foi utilizado", 400);
        if (!cupom.ativa) throw new AppError("A campanha deste cupom foi inativada", 400);
        if (cupom.validade && new Date(cupom.validade) < new Date()) throw new AppError("Este cupom já expirou", 400);

        cupom_id = cupom.cupom_id;
        const valor_desconto = parseFloat(cupom.valor_desconto);

        if (cupom.tipo_desconto === "percentual") {
          total = total - (total * (valor_desconto / 100));
        } else if (cupom.tipo_desconto === "fixo") {
          total = total - valor_desconto;
        }

        if (total < 0) total = 0;
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

      // Atualiza o status do cupom para usado
      if (cupom_id) {
        await client.query(
          "UPDATE cupons SET usado = true, usado_em = CURRENT_TIMESTAMP WHERE id = $1",
          [cupom_id]
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

  buscarItens: async (pedidoId: number): Promise<any[]> => {
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
