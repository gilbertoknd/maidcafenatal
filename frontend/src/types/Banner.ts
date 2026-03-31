export interface Banner {
  id?: number;
  pagina: string;
  tipo: "video" | "image";
  url: string;
  titulo?: string | null;
  subtitulo?: string | null;
  texto_botao?: string | null;
  link_botao?: string | null;
}
