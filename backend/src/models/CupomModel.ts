import { pool } from "../config/db.js";
import { AppError } from "../errors/AppError.js";

interface ResgateCupomDTO {
  campanha_id: number;
  cliente_nome: string;
  cliente_whatsapp: string;
  fingerprint_token: string;
  ip_cliente?: string;
}

// Entrada da criação de campanha (já validada no controller via zod).
// `validade` chega como string ISO ou null; o pg aceita ambos no TIMESTAMP.
interface CriarCampanhaInput {
  nome: string;
  descricao?: string | null;
  prefixo: string;
  tipo_desconto: "percentual" | "fixo";
  valor_desconto: number;
  limite_total?: number | null;
  ativa?: boolean;
  validade?: string | Date | null;
}

export class CupomModel {
  static async listarCampanhasAtivas() {
    const { rows } = await pool.query(
      `SELECT * FROM campanhas_cupom 
       WHERE ativa = true 
       AND (validade IS NULL OR validade > CURRENT_TIMESTAMP)`
    );
    return rows;
  }

  static async resgatarCupom(dados: ResgateCupomDTO) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Check if campaign exists and is active
      const resCampanha = await client.query(
        `SELECT c.*, 
                (SELECT COUNT(*) FROM cupons WHERE campanha_id = c.id) as qtd_cupons 
         FROM campanhas_cupom c 
         WHERE c.id = $1 AND c.ativa = true 
         AND (c.validade IS NULL OR c.validade > CURRENT_TIMESTAMP)`,
        [dados.campanha_id]
      );

      if (resCampanha.rowCount === 0) {
        throw new AppError("Campanha não encontrada, inativa ou expirada", 404);
      }

      const campanha = resCampanha.rows[0];

      // 2. Check limits
      if (campanha.limite_total !== null && parseInt(campanha.qtd_cupons) >= campanha.limite_total) {
        throw new AppError("O limite de cupons desta campanha já foi atingido", 400);
      }

      // 3. Check uniqueness (WhatsApp)
      const resWhats = await client.query(
        `SELECT id FROM cupons WHERE campanha_id = $1 AND cliente_whatsapp = $2`,
        [dados.campanha_id, dados.cliente_whatsapp]
      );
      if ((resWhats.rowCount ?? 0) > 0) {
        throw new AppError("Este número de WhatsApp já resgatou um cupom para esta campanha", 400);
      }

      // 4. Check uniqueness (Fingerprint)
      const resFingerprint = await client.query(
        `SELECT id FROM cupons WHERE campanha_id = $1 AND fingerprint_token = $2`,
        [dados.campanha_id, dados.fingerprint_token]
      );
      if ((resFingerprint.rowCount ?? 0) > 0) {
        throw new AppError("Este dispositivo já resgatou um cupom para esta campanha", 400);
      }

      // 5. Generate unique code
      const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const codigo = `${campanha.prefixo}-${uniqueSuffix}`;

      // 6. Insert cupom
      const result = await client.query(
        `INSERT INTO cupons (campanha_id, codigo, cliente_nome, cliente_whatsapp, fingerprint_token, ip_cliente)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING codigo`,
        [dados.campanha_id, codigo, dados.cliente_nome, dados.cliente_whatsapp, dados.fingerprint_token, dados.ip_cliente]
      );

      await client.query("COMMIT");
      return result.rows[0];

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async validarCupom(codigo: string) {
    const { rows } = await pool.query(
      `SELECT c.id as cupom_id, c.codigo, c.usado, c.cliente_nome, 
              cam.id as campanha_id, cam.nome as campanha_nome, cam.tipo_desconto, 
              cam.valor_desconto, cam.ativa, cam.validade
       FROM cupons c
       JOIN campanhas_cupom cam ON c.campanha_id = cam.id
       WHERE c.codigo = $1`,
      [codigo]
    );

    if (rows.length === 0) {
      throw new AppError("Cupom não encontrado", 404);
    }

    const cupom = rows[0];

    if (cupom.usado) {
      throw new AppError("Este cupom já foi utilizado", 400);
    }

    if (!cupom.ativa) {
      throw new AppError("A campanha deste cupom foi inativada", 400);
    }

    if (cupom.validade && new Date(cupom.validade) < new Date()) {
      throw new AppError("Este cupom já expirou", 400);
    }

    return cupom;
  }

  static async listarCampanhasAdmin() {
    const { rows } = await pool.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM cupons WHERE campanha_id = c.id) as qtd_resgatados,
              (SELECT COUNT(*) FROM cupons WHERE campanha_id = c.id AND usado = true) as qtd_usados
       FROM campanhas_cupom c 
       ORDER BY c.criado_em DESC`
    );
    return rows;
  }

  static async criarCampanha(dados: CriarCampanhaInput) {
    const { rows } = await pool.query(
      `INSERT INTO campanhas_cupom (nome, descricao, prefixo, tipo_desconto, valor_desconto, limite_total, ativa, validade)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        dados.nome,
        dados.descricao ?? null,
        dados.prefixo,
        dados.tipo_desconto,
        dados.valor_desconto,
        dados.limite_total ?? null,
        dados.ativa ?? true,
        dados.validade ?? null,
      ]
    );
    return rows[0];
  }

  static async listarCuponsAdmin(campanha_id?: number) {
    let query = `
      SELECT c.*, cam.nome as campanha_nome 
      FROM cupons c
      JOIN campanhas_cupom cam ON c.campanha_id = cam.id
    `;
    const params: any[] = [];

    if (campanha_id) {
      query += ` WHERE c.campanha_id = $1`;
      params.push(campanha_id);
    }

    query += ` ORDER BY c.criado_em DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
  }
}
