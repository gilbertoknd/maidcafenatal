export class AppError {
  //Propriedades "public readonly"
  //PUBLIC: Pode ser acessada fora da classe (pelo seu errorHandler).
  public readonly message: string;
  public readonly statusCode: number;

  //O Construtor
  //Define o valor padrão de statusCode para 400 (Bad Request).
  //90% dos erros manuais são erros do cliente (dados inválidos).
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
