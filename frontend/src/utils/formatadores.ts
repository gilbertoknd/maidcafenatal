export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function formatEventDate(dataInicioStr: string, dataFimStr?: string | null): string {
  const dataInicio = new Date(dataInicioStr);
  const formataHora = (d: Date) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  
  const diaDaSemana = dataInicio.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const dataInicioStrFormatted = dataInicio.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
  const horaInicio = formataHora(dataInicio);

  if (!dataFimStr) {
    return `${diaDaSemana}, ${dataInicioStrFormatted} às ${horaInicio}`;
  }

  const dataFim = new Date(dataFimStr);
  const diaSemanaFim = dataFim.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const dataFimStrFormatada = dataFim.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
  const horaFim = formataHora(dataFim);

  // Se for no mesmo dia
  if (dataInicio.toDateString() === dataFim.toDateString()) {
    return `${diaDaSemana}, ${dataInicioStrFormatted} das ${horaInicio} às ${horaFim}`;
  }

  // Se forem dias diferentes
  return `De ${diaDaSemana}, ${dataInicioStrFormatted} (${horaInicio}) até ${diaSemanaFim}, ${dataFimStrFormatada} (${horaFim})`;
}
