import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import styles from "./styles.module.css";
import { useBanners, useAdminBanners } from "../../hooks/useBanners";

export function AdminBanners() {
  const { data: banners, isLoading } = useBanners();
  const { mutationAtualizar } = useAdminBanners();

  const [pagina, setPagina] = useState("home");

  const [formData, setFormData] = useState({
    tipo: "image" as "image" | "video",
    url: "",
    titulo: "",
    texto_botao: "",
    link_botao: "",
    arquivo: null as File | null,
  });

  useEffect(() => {
    if (banners) {
      const bannerPage = banners.find((b) => b.pagina === pagina);
      if (bannerPage) {
        setFormData({
          tipo: bannerPage.tipo,
          url: bannerPage.url,
          titulo: bannerPage.titulo || "",
          texto_botao: bannerPage.texto_botao || "",
          link_botao: bannerPage.link_botao || "",
          arquivo: null,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          url: "",
          titulo: "",
          texto_botao: "",
          link_botao: "",
          arquivo: null,
        }));
      }
    }
  }, [pagina, banners]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, arquivo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.arquivo && !formData.url) {
      alert("Você precisa enviar um arquivo ou já ter um selecionado.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("tipo", formData.tipo);
      if (formData.url) payload.append("url", formData.url);

      // Enviamos apenas se o admin preencher, senão enviamos vazio.
      if (formData.titulo) payload.append("titulo", formData.titulo);
      if (formData.texto_botao)
        payload.append("texto_botao", formData.texto_botao);
      if (formData.link_botao)
        payload.append("link_botao", formData.link_botao);

      if (formData.arquivo) payload.append("midia", formData.arquivo); // o Multer vai pegar esse

      await mutationAtualizar.mutateAsync({ pagina, data: payload });
      alert("Configuração do Banner salva com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configuração do banner.");
    }
  };

  if (isLoading) return <p>Carregando banners...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Configuração de Banners Visuais</h2>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <select
            name="pagina"
            value={pagina}
            onChange={(e) => setPagina(e.target.value)}
            className={styles.input}
            style={{ fontWeight: "bold" }}
          >
            <option value="home">Página Principal (Home)</option>
            <option value="cardapio">Menu (Cardápio)</option>
            <option value="eventos">Aba Eventos</option>
            <option value="padrao">Banner Padrão (Fallback Default)</option>
          </select>

          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className={styles.input}
          >
            <option value="image">Imagem (Estático)</option>
            <option value="video">Vídeo (Dinâmico / AutoPlay)</option>
          </select>

          <div className={styles.fileInputContainer}>
            <label className={styles.fileLabel}>
              {formData.tipo === "video" ? (
                <>
                  <VideoIcon size={16} style={{ marginRight: "5px" }} /> Arquivo
                  de Vídeo (.mp4, .webm)
                </>
              ) : (
                <>
                  <ImageIcon size={16} style={{ marginRight: "5px" }} /> Arquivo
                  de Imagem (.jpeg, .png, .webp)
                </>
              )}
            </label>
            <input
              type="file"
              accept={formData.tipo === "video" ? "video/*" : "image/*"}
              onChange={handleFileChange}
              className={styles.fileInput}
              required={!formData.url} // Required se não existir um prévio
            />
            {formData.url && !formData.arquivo && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-success)",
                  marginTop: "0.5rem",
                }}
              >
                Mídia Atual Ativa:{" "}
                <strong>{formData.url.split("/").pop()}</strong>
              </p>
            )}
          </div>

          <label
            className={styles.fileLabel}
            style={{
              gridColumn: "span 2",
              marginBottom: "-10px",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            Textos Opcionais de Sobreposição (Somente exibidos se existirem)
          </label>

          <input
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            placeholder="Título (Ex: Novos Drinks Mágicos)"
            className={styles.input}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              name="texto_botao"
              value={formData.texto_botao}
              onChange={handleInputChange}
              placeholder="Texto do Botão (Ex: Ir pra loja)"
              className={styles.input}
              style={{ flex: 1 }}
            />
            <input
              name="link_botao"
              value={formData.link_botao}
              onChange={handleInputChange}
              placeholder="Link do Botão (Ex: #loja)"
              className={styles.input}
              style={{ flex: 1 }}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnSubmit} ${styles.create}`}
              disabled={mutationAtualizar.isPending}
            >
              {mutationAtualizar.isPending ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={18} /> Salvar Banner da {pagina}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {formData.url && (
        <div className={styles.previewPanel}>
          <h3>Visualização do Banner Atual ({pagina})</h3>
          {formData.tipo === "video" ? (
            <video
              src={
                formData.url.startsWith("/images/")
                  ? import.meta.env.VITE_BACKEND_URL + formData.url
                  : formData.url
              }
              className={styles.previewMedia}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={
                formData.url.startsWith("/images/")
                  ? import.meta.env.VITE_BACKEND_URL + formData.url
                  : formData.url
              }
              className={styles.previewMedia}
              alt="Preview do Banner"
            />
          )}
        </div>
      )}
    </div>
  );
}
