import { pool } from "../config/db.js";

export class AuthModel {
  static async findByNickname(nickname: string) {
    const result = await pool.query("SELECT * FROM users WHERE nickname = $1", [
      nickname,
    ]);
    return result.rows[0];
  }
}
