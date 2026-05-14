import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buscarCampanhasAtivas, resgatarCupom, validarCupom } from "../services/api";

export function useCampanhasAtivas() {
  return useQuery({
    queryKey: ["campanhas-ativas"],
    queryFn: buscarCampanhasAtivas,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useResgatarCupom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resgatarCupom,
    onSuccess: () => {
      // Opcional: invalidar queries se necessário
      queryClient.invalidateQueries({ queryKey: ["campanhas-ativas"] });
    },
  });
}

export function useValidarCupom() {
  return useMutation({
    mutationFn: validarCupom,
  });
}
