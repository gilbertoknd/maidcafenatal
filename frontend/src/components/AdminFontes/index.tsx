import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  buscarConfiguracoes,
  atualizarConfiguracoes,
  uploadFonteCustomizada,
  deletarFonteCustomizada,
} from "../../services/api";
import styles from "./styles.module.css";
import { Trash2, UploadCloud, Save } from "lucide-react";

const FONTES_BUILTIN = [
  "Sweet Apricot",
  "Inter",
  "Arial",
  "Times New Roman",
  "Gochi Hand",
  "Pacifico",
];

const CATEGORIAS_FONTES = [
  { chave: "fonte_titulo_site", label: "Títulos do Site (Banners, h1)", preview: "Bem-vindo ao Mew Mew Café" },
  { chave: "fonte_navbar", label: "Navbar (Menu superior)", preview: "Início | Cardápio | Eventos" },
  { chave: "fonte_categorias", label: "Categorias (Cardápio)", preview: "Doces Japoneses" },
  { chave: "fonte_titulos_itens", label: "Títulos de Itens", preview: "Sakeirinha em dobro!" },
  { chave: "fonte_descricoes", label: "Descrições", preview: "Um delicioso bolinho tradicional japonês." },
  { chave: "fonte_botoes", label: "Botões", preview: "Adicionar ao Carrinho" },
  { chave: "fonte_geral", label: "Texto Geral", preview: "Preço: R$ 19,90" },
];

export default function AdminFontes() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadNome, setUploadNome] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
  });

  useEffect(() => {
    if (data?.configuracoes) {
      setFormData(data.configuracoes);
    }
  }, [data]);

  const mutationSalvar = useMutation({
    mutationFn: atualizarConfiguracoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      alert("Configurações salvas com sucesso!");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao salvar configurações");
    },
  });

  const mutationUpload = useMutation({
    mutationFn: uploadFonteCustomizada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      setUploadNome("");
      setUploadFile(null);
      // Reseta o input file
      const fileInput = document.getElementById("font-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      alert("Fonte enviada com sucesso!");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao fazer upload da fonte");
    },
  });

  const mutationDeletar = useMutation({
    mutationFn: deletarFonteCustomizada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao deletar a fonte");
    },
  });

  const handleSelectChange = (chave: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [chave]: valor }));
  };

  const handleSalvar = () => {
    setErrorMsg("");
    mutationSalvar.mutate(formData);
  };

  const handleUpload = () => {
    setErrorMsg("");
    if (!uploadNome.trim() || !uploadFile) {
      setErrorMsg("Nome e arquivo .woff2 são obrigatórios");
      return;
    }
    const form = new FormData();
    form.append("nome", uploadNome);
    form.append("fonte", uploadFile);
    mutationUpload.mutate(form);
  };

  const handleDeletar = (id: number, nome: string) => {
    // Verifica se a fonte está em uso
    const emUso = Object.values(formData).includes(nome);
    if (emUso) {
      alert(`A fonte "${nome}" está sendo usada atualmente. Troque-a antes de deletar.`);
      return;
    }
    if (window.confirm(`Tem certeza que deseja deletar a fonte "${nome}"?`)) {
      mutationDeletar.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando configurações...</div>;
  if (isError) return <div className={styles.error}>Erro ao carregar configurações.</div>;

  const fontesDisponiveis = [
    ...FONTES_BUILTIN,
    ...(data?.fontes_customizadas?.map((f) => f.nome) || []),
  ];

  return (
    <div className={styles.container}>
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Configuração de Fontes</h2>
        
        <h3 className={styles.sectionTitle}>Fontes por Categoria</h3>
        <div className={styles.formGrid}>
          {CATEGORIAS_FONTES.map(({ chave, label, preview }) => (
            <div key={chave} className={styles.formGroup}>
              <label className={styles.label}>{label}</label>
              <select
                className={styles.select}
                value={formData[chave] || ""}
                onChange={(e) => handleSelectChange(chave, e.target.value)}
              >
                {fontesDisponiveis.map((fonte) => (
                  <option key={fonte} value={fonte}>
                    {fonte}
                  </option>
                ))}
              </select>
              <div 
                className={styles.preview} 
                style={{ fontFamily: formData[chave] || "Inter" }}
              >
                {preview}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.saveButton}`}
            onClick={handleSalvar}
            disabled={mutationSalvar.isPending}
          >
            <Save size={20} />
            {mutationSalvar.isPending ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </div>

      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Upload de Fonte Customizada (.woff2)</h2>
        <div className={styles.uploadContainer}>
          <div className={styles.uploadRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome da Fonte</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ex: Another Shabby"
                value={uploadNome}
                onChange={(e) => setUploadNome(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Arquivo (.woff2)</label>
              <input
                id="font-upload"
                type="file"
                accept=".woff2"
                className={styles.fileInput}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button
              className={`${styles.btn} ${styles.create}`}
              onClick={handleUpload}
              disabled={mutationUpload.isPending}
            >
              <UploadCloud size={20} />
              {mutationUpload.isPending ? "Enviando..." : "Fazer Upload"}
            </button>
          </div>

          {data?.fontes_customizadas && data.fontes_customizadas.length > 0 && (
            <div className={styles.fontsList}>
              <h4 className={styles.sectionTitle} style={{ marginTop: 16 }}>Fontes Enviadas</h4>
              {data.fontes_customizadas.map((fonte) => (
                <div key={fonte.id} className={styles.fontItem}>
                  <div className={styles.fontInfo}>
                    <span className={styles.fontName}>{fonte.nome}</span>
                    <span className={styles.fontPath}>{fonte.arquivo_url}</span>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeletar(fonte.id, fonte.nome)}
                    disabled={mutationDeletar.isPending}
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
