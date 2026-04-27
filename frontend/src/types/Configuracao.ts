export interface FonteCustomizada {
  id: number;
  nome: string;
  arquivo_url: string;
}

export interface ConfiguracoesFontes {
  configuracoes: Record<string, string>;
  fontes_customizadas: FonteCustomizada[];
}
