import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useCampanhasAtivas, useResgatarCupom } from "../../hooks/useCupons";
import styles from "./styles.module.css";
import { Ticket, Search, AlertCircle, Copy, Check } from "lucide-react";

function generateFingerprint() {
  let fp = localStorage.getItem("maid_fp");
  if (!fp) {
    fp = "fp_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("maid_fp", fp);
  }
  return fp;
}

export function CuponsPage() {
  const { data: campanhas, isLoading, isError } = useCampanhasAtivas();
  const resgatarMutation = useResgatarCupom();

  // Número pré-preenchido quando o cliente chega pelo Clube Mew da home
  const location = useLocation();
  const whatsappInicial =
    (location.state as { whatsapp?: string } | null)?.whatsapp ?? "";

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState(whatsappInicial);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<number | null>(null);
  
  const [cupomGerado, setCupomGerado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatWhatsApp = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 10) {
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  const handleResgatar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setCupomGerado(null);

    if (!campanhaSelecionada) {
      setErrorMsg("Selecione uma campanha.");
      return;
    }

    if (whatsapp.length < 14) {
      setErrorMsg("WhatsApp inválido. Use o formato (XX) XXXXX-XXXX");
      return;
    }

    const fp = generateFingerprint();

    resgatarMutation.mutate({
      campanha_id: campanhaSelecionada,
      cliente_nome: nome,
      cliente_whatsapp: whatsapp,
      fingerprint_token: fp
    }, {
      onSuccess: (data) => {
        setCupomGerado(data.codigo);
        setNome("");
        setWhatsapp("");
        setCampanhaSelecionada(null);
      },
      onError: (err: Error) => {
        setErrorMsg(err.message || "Erro ao resgatar cupom");
      }
    });
  };

  const handleCopy = () => {
    if (cupomGerado) {
      navigator.clipboard.writeText(cupomGerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Resgatar Cupons</h1>
          <p>Garanta descontos exclusivos para o Mew Mew Café!</p>
        </section>

        <section className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <Search size={40} className={styles.spin} />
              <p>Buscando campanhas ativas...</p>
            </div>
          ) : isError ? (
            <div className={styles.error}>
              <AlertCircle size={40} />
              <p>Não foi possível carregar as campanhas. Tente novamente mais tarde.</p>
            </div>
          ) : !campanhas || campanhas.length === 0 ? (
            <div className={styles.empty}>
              <Ticket size={48} />
              <h3>Nenhuma campanha ativa</h3>
              <p>Fique de olho em nossas redes sociais para não perder as próximas promoções!</p>
            </div>
          ) : (
            <div className={styles.layout}>
              <div className={styles.campaigns}>
                <h2>Campanhas Disponíveis</h2>
                <div className={styles.grid}>
                  {campanhas.map(camp => (
                    <div 
                      key={camp.id} 
                      className={`${styles.card} ${campanhaSelecionada === camp.id ? styles.selected : ''}`}
                      onClick={() => setCampanhaSelecionada(camp.id)}
                    >
                      <div className={styles.cardHeader}>
                        <h3>{camp.nome}</h3>
                        <span className={styles.badge}>
                          {camp.tipo_desconto === "percentual" ? `${camp.valor_desconto}% OFF` : `R$ ${camp.valor_desconto} OFF`}
                        </span>
                      </div>
                      <p className={styles.description}>{camp.descricao}</p>
                      {camp.limite_total && (
                        <p className={styles.limit}>
                          Restam: <strong>{camp.limite_total - parseInt(camp.qtd_cupons)}</strong> cupons
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formSection}>
                <div className={styles.formCard}>
                  <h2>Gere seu Cupom</h2>
                  
                  {cupomGerado ? (
                    <div className={styles.successBox}>
                      <Ticket size={48} color="var(--color-primary)" />
                      <h3>Cupom Gerado com Sucesso!</h3>
                      <p>Apresente o código abaixo no caixa ou use-o aqui no site para o pedido online.</p>
                      
                      <div className={styles.codeBox} onClick={handleCopy}>
                        <span>{cupomGerado}</span>
                        <button title="Copiar código">
                          {copiado ? <Check size={20} color="green" /> : <Copy size={20} />}
                        </button>
                      </div>
                      {copiado && <p className={styles.copiedText}>Copiado para a área de transferência!</p>}
                      
                      <button 
                        className={styles.resetBtn}
                        onClick={() => setCupomGerado(null)}
                      >
                        Gerar Outro Cupom
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResgatar} className={styles.form}>
                      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
                      
                      <div className={styles.inputGroup}>
                        <label>Nome Completo</label>
                        <input 
                          type="text" 
                          required 
                          value={nome}
                          onChange={e => setNome(e.target.value)}
                          placeholder="Digite seu nome"
                        />
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <label>WhatsApp</label>
                        <input 
                          type="text" 
                          required 
                          value={whatsapp}
                          onChange={e => setWhatsapp(formatWhatsApp(e.target.value))}
                          placeholder="(84) 99999-9999"
                          maxLength={15}
                        />
                      </div>

                      <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={resgatarMutation.isPending || !campanhaSelecionada}
                      >
                        {resgatarMutation.isPending ? "Gerando..." : "Resgatar Cupom"}
                      </button>
                      {!campanhaSelecionada && (
                        <p className={styles.hint}>Selecione uma campanha ao lado para resgatar.</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
