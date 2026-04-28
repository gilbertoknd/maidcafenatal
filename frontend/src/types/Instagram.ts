export interface InstagramPost {
    id: number;
    imagem_url: string;
    link_url: string;
    visivel: boolean;
    ordem: number;
    criado_em?: string;
}

export interface CreateInstagramPostData {
    imagem: File;
    link_url: string;
    ordem?: number;
}

export interface UpdateInstagramPostData {
    imagem?: File;
    link_url?: string;
    visivel?: boolean;
    ordem?: number;
}
