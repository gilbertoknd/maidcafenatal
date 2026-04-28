export interface InstagramPost {
    id: number;
    imagem_url: string;
    link_url: string;
    visivel: boolean;
    ordem: number;
    criado_em?: Date;
}

export interface CreateInstagramPostData {
    imagem_url: string;
    link_url: string;
    ordem?: number;
}

export interface UpdateInstagramPostData {
    imagem_url?: string;
    link_url?: string;
    visivel?: boolean;
    ordem?: number;
}
