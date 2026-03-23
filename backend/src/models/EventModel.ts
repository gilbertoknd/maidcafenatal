import { pool } from "../config/db.js";
import { EventData } from "../types/EventTypes.js";

export async function listAllEvents() {
  const result = await pool.query("SELECT * FROM eventos WHERE visivel = true ORDER BY data ASC");
  return result.rows;
}

export async function listAllEventsAdmin() {
  const result = await pool.query("SELECT * FROM eventos ORDER BY data DESC");
  return result.rows;
}

export async function createEvent(data: EventData) {
  const query = `
    INSERT INTO eventos (titulo, descricao, data, local, imagem_url, visivel)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    data.titulo,
    data.descricao || null,
    data.data,
    data.local,
    data.imagemUrl || null,
    data.visivel ?? true,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateEvent(id: string | number, data: EventData) {
  const query = `
    UPDATE eventos
    SET titulo = $1,
        descricao = $2,
        data = $3,
        local = $4,
        imagem_url = COALESCE($5, imagem_url),
        visivel = $6
    WHERE id = $7
    RETURNING *;
  `;
  const values = [
    data.titulo,
    data.descricao || null,
    data.data,
    data.local,
    data.imagemUrl === undefined ? null : data.imagemUrl,
    data.visivel ?? true,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteEvent(id: string | number) {
  const result = await pool.query("DELETE FROM eventos WHERE id = $1 RETURNING *", [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function toggleEventVisibility(id: string | number) {
  const query = `
    UPDATE eventos
    SET visivel = NOT visivel
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}
