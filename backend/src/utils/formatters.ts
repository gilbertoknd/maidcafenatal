//formatador de data, validador de cpf...

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}
