import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buscarBanners, atualizarBanner } from "../services/api";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: buscarBanners,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useAdminBanners() {
  const queryClient = useQueryClient();

  const mutationAtualizar = useMutation({
    mutationFn: ({ pagina, data }: { pagina: string; data: FormData }) => atualizarBanner(pagina, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  return {
    mutationAtualizar,
  };
}
