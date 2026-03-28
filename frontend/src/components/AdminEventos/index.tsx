import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { 
  getEventosAdmin, 
  criarEvento, 
  atualizarEvento, 
  deletarEvento, 
  alterarVisibilidadeEvento 
} from "../../services/api";
import type { Evento, EventoFormData } from "../../types/Evento";
import { EventoCard } from "../EventoCard";

export function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<EventoFormData>({
    titulo: "",
    descricao: "",
    data: "",
    local: "",
    visivel: true,
    imagem: null,
  });

  const buscarEventos = async () => {
    try {
      setLoading(true);
      const data = await getEventosAdmin();
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
    
    // Converter a data para o formato aceito pelo input datetime-local
    // A API retorna uma string ISO. input datetime-local espera YYYY-MM-DDThh:mm
    const dateObj = new Date(evento.data);
    const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset em milissegundos
    const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);

    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao || "",
      data: localISOTime,
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
      local: "",
      visivel: true,
      imagem: null,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formPanel}>
        <h2>{editingId ? "Editar Evento" : "Novo Evento"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Título do Evento *</label>
            <input 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleInputChange} 
              required 
              placeholder="Ex: Festa do Chá"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Descrição</label>
            <textarea 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleInputChange} 
              rows={3} 
              placeholder="Detalhes sobre o evento..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Imagem de Divulgação</label>
            <input 
              type="file" 
              name="imagem" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Data e Hora *</label>
              <input 
                name="data" 
                type="datetime-local" 
                value={formData.data} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Local *</label>
              <input 
                name="local" 
                value={formData.local} 
                onChange={handleInputChange} 
                required 
                placeholder="Ex: Mew Mew Café Centro"
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              name="visivel" 
              id="event-visivel"
              checked={formData.visivel}
              onChange={handleInputChange} 
            />
            <label htmlFor="event-visivel">Evento Visível para o Público</label>
          </div>

          <div className={styles.formActions}>
            {editingId && (
              <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                Cancelar
              </button>
            )}
            <button type="submit" className={styles.submitBtn}>
              {editingId ? "Salvar Alterações" : "Criar Evento"}
            </button>
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
