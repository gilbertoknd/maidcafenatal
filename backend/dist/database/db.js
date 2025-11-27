"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Cria a piscina de conexões
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "5432"),
});
//Evento para avisar no console quando conectar
exports.pool.on("connect", () => {
    console.log("Conexão com banco de dados estabelecida.");
});
exports.pool.on("error", (err) => {
    console.error("Erro inesperado no banco de dados", err);
    process.exit(-1);
});
