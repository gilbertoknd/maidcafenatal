import { useState } from "react";
import { z } from "zod";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Send } from "lucide-react";
import styles from "./styles.module.css";

const TIPOS_SERVICO = [
  { emoji: "🎂", nome: "Aniversário temático" },
  { emoji: "🎓", nome: "Formatura / Confraternização" },
  { emoji: "📦", nome: "Encomenda de doces/comidas" },
  { emoji: "🎉", nome: "Evento personalizado" },
  { emoji: "🚚", nome: "Delivery" },
];

const WHATSAPP_MEW_MEW = "558486643897";

const esquemaAgendamento = z.object({
  tipoServico: z.string().min(1, "Escolha o tipo de serviço."),
  nome: z.string().trim().min(2, "Informe seu nome completo."),
  telefone: z
    .string()
    .min(14, "Telefone inválido. Use o formato (XX) XXXXX-XXXX."),
  data: z.string().min(1, "Escolha a data desejada."),
});

type ErrosFormulario = Partial<
  Record<keyof z.infer<typeof esquemaAgendamento>, string>
>;

function formatarTelefone(value: string) {
  const v = value.replace(/\D/g, "");
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

function formatarData(dataIso: string) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function AgendarPage() {
  const [tipoServico, setTipoServico] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [convidados, setConvidados] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();

    const resultado = esquemaAgendamento.safeParse({
      tipoServico,
      nome,
      telefone,
      data,
    });

    if (!resultado.success) {
      const novosErros: ErrosFormulario = {};
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof ErrosFormulario;
        if (!novosErros[campo]) novosErros[campo] = issue.message;
      }
      setErros(novosErros);
      return;
    }
    setErros({});

    const linhas = [
      "🎀 Novo pedido — Mew Mew Café 🎀",
      "",
      `Tipo: ${resultado.data.tipoServico}`,
      `Nome: ${resultado.data.nome}`,
      `Telefone: ${resultado.data.telefone}`,
      `Data: ${formatarData(resultado.data.data)}`,
    ];
    if (horario) linhas.push(`Horário: ${horario}`);
    if (local.trim()) linhas.push(`Local: ${local.trim()}`);
    if (convidados) linhas.push(`Convidados: ${convidados}`);
    if (detalhes.trim()) linhas.push(`Detalhes: ${detalhes.trim()}`);
    linhas.push("", "Enviado pelo site mewworld.space");

    const url = `https://wa.me/${WHATSAPP_MEW_MEW}?text=${encodeURIComponent(
      linhas.join("\n")
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Agende seu evento ♡</h1>
          <p>Preencha o formulário e a gente cuida da magia!</p>
        </section>

        <section className={styles.content}>
          <form onSubmit={handleEnviar} className={styles.form} noValidate>
            {/* Tipo de serviço — cards clicáveis (radios) */}
            <fieldset className={styles.serviceFieldset}>
              <legend className={styles.legend}>Tipo de serviço</legend>
              <div className={styles.serviceGrid}>
                {TIPOS_SERVICO.map(({ emoji, nome: nomeTipo }) => (
                  <label
                    key={nomeTipo}
                    className={`${styles.serviceCard} ${
                      tipoServico === nomeTipo ? styles.serviceSelected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoServico"
                      value={nomeTipo}
                      checked={tipoServico === nomeTipo}
                      onChange={() => setTipoServico(nomeTipo)}
                      className={styles.serviceRadio}
                    />
                    <span className={styles.serviceEmoji} aria-hidden="true">
                      {emoji}
                    </span>
                    <span className={styles.serviceName}>{nomeTipo}</span>
                  </label>
                ))}
              </div>
              {erros.tipoServico && (
                <p className={styles.fieldError}>{erros.tipoServico}</p>
              )}
            </fieldset>

            <div className={styles.inputGroup}>
              <label htmlFor="agendar-nome">Nome completo *</label>
              <input
                id="agendar-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
              />
              {erros.nome && <p className={styles.fieldError}>{erros.nome}</p>}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="agendar-telefone">Telefone *</label>
                <input
                  id="agendar-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  placeholder="(84) 99999-9999"
                  maxLength={15}
                />
                {erros.telefone && (
                  <p className={styles.fieldError}>{erros.telefone}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="agendar-data">Data desejada *</label>
                <input
                  id="agendar-data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
                {erros.data && (
                  <p className={styles.fieldError}>{erros.data}</p>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="agendar-horario">Horário preferido</label>
                <input
                  id="agendar-horario"
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="agendar-convidados">Número de convidados</label>
                <input
                  id="agendar-convidados"
                  type="number"
                  min={1}
                  value={convidados}
                  onChange={(e) => setConvidados(e.target.value)}
                  placeholder="Quantos?"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="agendar-local">Local do evento</label>
              <input
                id="agendar-local"
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder='Ex: "minha casa", "salão de festas"'
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="agendar-detalhes">Detalhes adicionais</label>
              <textarea
                id="agendar-detalhes"
                rows={4}
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                placeholder="Tema, personagens, restrições alimentares..."
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <Send size={18} /> Enviar pelo WhatsApp ♡
            </button>
            <p className={styles.hint}>
              Você será direcionadx para o nosso WhatsApp com a mensagem
              pronta.
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
