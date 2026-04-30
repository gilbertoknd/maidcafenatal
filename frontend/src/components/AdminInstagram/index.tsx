import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Save } from "lucide-react";
import styles from "./styles.module.css";
import { useAdminInstagram } from "../../hooks/useAdminInstagram";
import type { InstagramPost } from "../../types/Instagram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function AdminInstagram() {
  const {
    posts,
    loading,
    buscarPosts,
    salvarPost,
    deletarPost,
    alternarVisibilidade,
  } = useAdminInstagram();
  const [editingPost, setEditingPost] = useState<Partial<InstagramPost> | null>(
    null,
  );
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    buscarPosts();
  }, [buscarPosts]);

  const handleEdit = (post: InstagramPost | null) => {
    setEditingPost(post);
    setArquivo(null);
  };

  const handleNovoPost = () => {
    setEditingPost({ link_url: "", ordem: 0 });
    setArquivo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const formData = new FormData();
    if (arquivo) formData.append("imagem", arquivo);
    formData.append("link_url", editingPost.link_url || "");
    formData.append("ordem", String(editingPost.ordem || 0));

    const result = await salvarPost(formData, editingPost.id);
    if (result) {
      handleEdit(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      await deletarPost(id);
    }
  };

  if (loading && posts.length === 0) return <p>Carregando posts...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Gerenciar Feed do Instagram</h2>
        <button className={styles.addButton} onClick={handleNovoPost}>
          <Plus size={20} />
          Novo Post
        </button>
      </header>

      {editingPost && (
        <div
          className={styles.modalOverlay}
          onClick={() => handleEdit(null)}
          data-testid="modal-overlay"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{editingPost.id ? "Editar Post" : "Novo Post"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Link do Instagram</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/p/..."
                  value={editingPost.link_url || ""}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, link_url: e.target.value })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Imagem do Post</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingPost.id}
                  onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                />
                {editingPost.imagem_url && !arquivo && (
                  <p className={styles.currentFile}>
                    Atual: {editingPost.imagem_url.split("/").pop()}
                  </p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Ordem de Exibição</label>
                <input
                  type="number"
                  value={editingPost.ordem || 0}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      ordem: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => handleEdit(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <Save size={18} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.cardImage}>
              <img
                src={`${BACKEND_URL}${post.imagem_url}`}
                alt="Instagram post"
              />
              <div className={styles.cardOverlay}>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleEdit(post)}
                  title="Editar"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => alternarVisibilidade(post.id, post.visivel)}
                  title={post.visivel ? "Ocultar" : "Mostrar"}
                >
                  {post.visivel ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(post.id)}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.cardLink} title={post.link_url}>
                {post.link_url}
              </p>
              <span className={styles.cardOrdem}>Ordem: {post.ordem}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
