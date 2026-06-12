import { useState, useEffect } from "react";
import { Edit, Plus, X } from "lucide-react";
import styles from "./styles.module.css";
import { 
  buscarEventosAdmin, 
  criarEvento, 
  atualizarEvento, 
  deletarEvento, 
  alterarVisibilidadeEvento 
} from "../../services/api";
import type { Evento, DadosFormEvento } from "../../types/Evento";
import { EventoCard } from "../EventoCard";

export function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<DadosFormEvento>({
    titulo: "",
    descricao: "",
    data: "",
    data_fim: "",
    local: "",
    visivel: true,
    imagem: null,
  });

  const buscarEventos = async () => {
    try {
      setLoading(true);
      const data = await buscarEventosAdmin();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao buscar eventos do admin", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, imagem: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateObj = new Date(formData.data as string);
      
      const payload = new FormData();
      payload.append("titulo", formData.titulo);
      if (formData.descricao) payload.append("descricao", formData.descricao);
      payload.append("data", dateObj.toISOString());
      
      if (formData.data_fim) {
        const dateFimObj = new Date(formData.data_fim as string);
        payload.append("data_fim", dateFimObj.toISOString());
      } else {
        payload.append("data_fim", "");
      }

      payload.append("local", formData.local);
      payload.append("visivel", String(formData.visivel));
      if (formData.imagem) {
        payload.append("imagem", formData.imagem);
      }

      if (editingId) {
        await atualizarEvento(editingId, payload);
        alert("Evento atualizado com sucesso!");
      } else {
        await criarEvento(payload);
        alert("Evento criado com sucesso!");
      }
      resetForm();
      buscarEventos();
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro ao salvar evento. Verifique os dados.");
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingId(evento.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Converter a data para o formato aceito pelo input datetime-local
    // A API retorna uma string ISO. input datetime-local espera YYYY-MM-DDThh:mm
    const dateObj = new Date(evento.data);
    const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset em milissegundos
    const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);

    let localISODataFim = "";
    if (evento.data_fim) {
      const dateFimObj = new Date(evento.data_fim);
      const tzOffsetFim = dateFimObj.getTimezoneOffset() * 60000;
      localISODataFim = (new Date(dateFimObj.getTime() - tzOffsetFim)).toISOString().slice(0, 16);
    }

    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao || "",
      data: localISOTime,
      data_fim: localISODataFim,
      local: evento.local,
      visivel: evento.visivel,
      imagem: null,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Certeza que deseja deletar este evento?")) return;
    try {
      await deletarEvento(id);
      buscarEventos();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  const handleToggleVis = async (id: number) => {
    try {
      await alterarVisibilidadeEvento(id);
      buscarEventos();
    } catch (error) {
      console.error("Erro ao alterar visibilidade", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      titulo: "",
      descricao: "",
      data: "",
      data_fim: "",
      local: "",
      visivel: true,
      imagem: null,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>
          {editingId ? "Editando Evento" : "Novo Evento"}
        </h2>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <input 
            name="titulo" 
            value={formData.titulo} 
            onChange={handleInputChange} 
            required 
            placeholder="Título do Evento (Ex: Festa do Chá)"
            className={styles.input}
          />
          
          <input 
            name="local" 
            value={formData.local} 
            onChange={handleInputChange} 
            required 
            placeholder="Localização (Ex: Mew Mew Café Centro)"
            className={styles.input}
          />

          <div className={styles.inputGroup}>
            <label htmlFor="event-data" className={styles.label}>Data de Início *</label>
            <input 
              id="event-data"
              name="data" 
              type="datetime-local" 
              value={formData.data} 
              onChange={handleInputChange} 
              required 
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="event-data-fim" className={styles.label}>Data de Término (Opcional)</label>
            <input 
              id="event-data-fim"
              name="data_fim" 
              type="datetime-local" 
              value={formData.data_fim || ""} 
              onChange={handleInputChange} 
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              name="visivel" 
              id="event-visivel"
              checked={formData.visivel}
              onChange={handleInputChange} 
            />
            <label htmlFor="event-visivel" className={styles.checkboxLabel}>
              Evento Visível para o Público
            </label>
          </div>

          <textarea 
            name="descricao" 
            value={formData.descricao} 
            onChange={handleInputChange} 
            placeholder="Descrição detalhada do evento..."
            className={`${styles.input} ${styles.textarea}`}
          />

          <div className={styles.fileInputContainer}>
            <label htmlFor="event-imagem" className={styles.fileLabel}>Imagem de Divulgação (Opcional na Edição)</label>
            <input 
              id="event-imagem"
              type="file" 
              name="imagem" 
              accept="image/*"
              onChange={handleFileChange} 
              className={styles.fileInput}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={`${styles.btn} ${styles.btnSubmit} ${editingId ? styles.edit : styles.create}`}>
              {editingId ? <><Edit size={18} /> Salvar Alterações</> : <><Plus size={18} /> Cadastrar Evento</>}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={`${styles.btn} ${styles.btnCancel}`}>
                <X size={18} /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.listPanel}>
        <h2>Eventos Cadastrados</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.grid}>
            {eventos.map(ev => (
              <EventoCard 
                key={ev.id} 
                evento={ev} 
                isAdmin={true} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVis}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
