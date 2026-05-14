import { useState, useEffect } from "react";
import { Plus, Eye, Ticket } from "lucide-react";
import styles from "./styles.module.css";
import {
  buscarCampanhasAdmin,
  criarCampanhaAdmin,
  buscarCuponsAdmin,
} from "../../services/api";
import type { CampanhaCupom, CupomResgatado } from "../../types/Cupom";

interface FormCampanha {
  nome: string;
  descricao: string;
  prefixo: string;
  tipo_desconto: "percentual" | "fixo";
  valor_desconto: string;
  limite_total: string;
  validade: string;
  ativa: boolean;
}

const formInicial: FormCampanha = {
  nome: "",
  descricao: "",
  prefixo: "",
  tipo_desconto: "percentual",
  valor_desconto: "",
  limite_total: "",
  validade: "",
  ativa: true,
};

export function AdminCupons() {
  const [campanhas, setCampanhas] = useState<CampanhaCupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormCampanha>({ ...formInicial });

  // Estado para cupons expandidos por campanha
  const [cuponsExpandidos, setCuponsExpandidos] = useState<Record<number, CupomResgatado[]>>({});
  const [loadingCupons, setLoadingCupons] = useState<number | null>(null);

  const fetchCampanhas = async () => {
    try {
      setLoading(true);
      const data = await buscarCampanhasAdmin();
      setCampanhas(data);
    } catch (error) {
      console.error("Erro ao buscar campanhas admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, unknown> = {
        nome: formData.nome,
        descricao: formData.descricao,
        prefixo: formData.prefixo.toUpperCase(),
        tipo_desconto: formData.tipo_desconto,
        valor_desconto: parseFloat(formData.valor_desconto),
        ativa: formData.ativa,
      };

      if (formData.limite_total) {
        payload.limite_total = parseInt(formData.limite_total, 10);
      }
      if (formData.validade) {
        payload.validade = new Date(formData.validade).toISOString();
      }

      await criarCampanhaAdmin(payload);
      alert("Campanha criada com sucesso!");
      setFormData({ ...formInicial });
      fetchCampanhas();
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      alert("Erro ao criar campanha. Verifique os dados.");
    }
  };

  const handleVerCupons = async (campanhaId: number) => {
    // Se já está expandido, colapsar
    if (cuponsExpandidos[campanhaId]) {
      setCuponsExpandidos((prev) => {
        const copia = { ...prev };
        delete copia[campanhaId];
        return copia;
      });
      return;
    }

    try {
      setLoadingCupons(campanhaId);
      const cupons = await buscarCuponsAdmin(campanhaId);
      setCuponsExpandidos((prev) => ({ ...prev, [campanhaId]: cupons }));
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    } finally {
      setLoadingCupons(null);
    }
  };

  const formatarData = (data: string | null) => {
    if (!data) return "Sem validade";
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(data));
  };

  return (
    <div className={styles.container}>
      {/* Formulário de criação */}
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Nova Campanha</h2>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
            placeholder="Nome da campanha"
            className={styles.input}
          />

          <input
            name="prefixo"
            value={formData.prefixo}
            onChange={handleInputChange}
            required
            placeholder="Prefixo (Ex: MEW)"
            className={styles.input}
            maxLength={10}
          />

          <select
            name="tipo_desconto"
            value={formData.tipo_desconto}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Fixo (R$)</option>
          </select>

          <input
            name="valor_desconto"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor_desconto}
            onChange={handleInputChange}
            required
            placeholder="Valor do desconto"
            className={styles.input}
          />

          <input
            name="limite_total"
            type="number"
            min="0"
            value={formData.limite_total}
            onChange={handleInputChange}
            placeholder="Limite de cupons (vazio = ilimitado)"
            className={styles.input}
          />

          <input
            name="validade"
            type="datetime-local"
            value={formData.validade}
            onChange={handleInputChange}
            className={styles.input}
            style={{ color: "#000" }}
          />

          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Descrição da campanha"
            className={`${styles.input} ${styles.textarea}`}
          />

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="ativa"
              id="campanha-ativa"
              checked={formData.ativa}
              onChange={handleInputChange}
            />
            <label htmlFor="campanha-ativa" className={styles.checkboxLabel}>
              Campanha Ativa
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={`${styles.btn} ${styles.btnSubmit}`}>
              <Plus size={18} /> Criar Campanha
            </button>
          </div>
        </form>
      </div>

      {/* Listagem de campanhas */}
      <div className={styles.listPanel}>
        <h2>Campanhas Cadastradas</h2>
        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : campanhas.length === 0 ? (
          <div className={styles.empty}>
            <Ticket size={40} />
            <p>Nenhuma campanha cadastrada.</p>
          </div>
        ) : (
          campanhas.map((camp) => (
            <div key={camp.id} className={styles.campanhaCard}>
              <div className={styles.campanhaHeader}>
                <h3>{camp.nome}</h3>
                <span className={`${styles.badge} ${!camp.ativa ? styles.badgeInativa : ""}`}>
                  {camp.tipo_desconto === "percentual"
                    ? `${camp.valor_desconto}% OFF`
                    : `R$ ${camp.valor_desconto} OFF`}
                </span>
              </div>

              {camp.descricao && <p>{camp.descricao}</p>}

              <div className={styles.campanhaInfo}>
                <span>Prefixo: <strong>{camp.prefixo}</strong></span>
                <span>Cupons gerados: <strong>{camp.qtd_cupons}</strong></span>
                {camp.limite_total && (
                  <span>Limite: <strong>{camp.limite_total}</strong></span>
                )}
                <span>Validade: <strong>{formatarData(camp.validade)}</strong></span>
                <span>Status: <strong>{camp.ativa ? "Ativa" : "Inativa"}</strong></span>
              </div>

              <div className={styles.campanhaActions}>
                <button
                  className={styles.btnSmall}
                  onClick={() => handleVerCupons(camp.id)}
                  disabled={loadingCupons === camp.id}
                >
                  <Eye size={16} />
                  {cuponsExpandidos[camp.id] ? "Ocultar Cupons" : "Ver Cupons"}
                </button>
              </div>

              {/* Tabela de cupons expandida */}
              {cuponsExpandidos[camp.id] && (
                <table className={styles.cuponsTable}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cliente</th>
                      <th>WhatsApp</th>
                      <th>Status</th>
                      <th>Resgatado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuponsExpandidos[camp.id].length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          Nenhum cupom resgatado nesta campanha.
                        </td>
                      </tr>
                    ) : (
                      cuponsExpandidos[camp.id].map((cupom) => (
                        <tr key={cupom.id}>
                          <td><strong>{cupom.codigo}</strong></td>
                          <td>{cupom.cliente_nome}</td>
                          <td>{cupom.cliente_whatsapp}</td>
                          <td>
                            <span className={cupom.usado ? styles.statusUsado : styles.statusPendente}>
                              {cupom.usado ? "Usado" : "Pendente"}
                            </span>
                          </td>
                          <td>{formatarData(cupom.criado_em)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
