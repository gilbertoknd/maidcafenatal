import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alternarCurtidaProduto } from "../services/api";
import type { Produto } from "../types/Produto";

const STORAGE_KEY = "mewmew_liked_products";

export const useProductLike = (productId: number) => {
  const queryClient = useQueryClient();
  
  const [hasLiked, setHasLiked] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const likedArray: number[] = stored ? JSON.parse(stored) : [];
    return likedArray.includes(productId);
  });

  const mutation = useMutation({
    mutationFn: async (action: "like" | "unlike") => {
      return await alternarCurtidaProduto(productId, action);
    },
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ["produtos"] });
      const previousProducts = queryClient.getQueryData<Produto[]>(["produtos"]);

      queryClient.setQueriesData<Produto[]>({ queryKey: ["produtos"] }, (old) => {
        if (!old) return old;
        return old.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              curtidas: action === "like" ? p.curtidas + 1 : p.curtidas - 1,
            };
          }
          return p;
        });
      });

      return { previousProducts };
    },
    onError: (_err, _action, context) => {
      if (context?.previousProducts) {
        queryClient.setQueriesData({ queryKey: ["produtos"] }, context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });

  const handleLike = async () => {
    const action = hasLiked ? "unlike" : "like";
    setHasLiked(!hasLiked);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    let likedArray: number[] = stored ? JSON.parse(stored) : [];
    if (action === "like") {
      if (!likedArray.includes(productId)) likedArray.push(productId);
    } else {
      likedArray = likedArray.filter((id) => id !== productId);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedArray));

    try {
      await mutation.mutateAsync(action);
    } catch (error) {
      setHasLiked(hasLiked);
      const revertedArray = hasLiked 
        ? [...likedArray, productId] 
        : likedArray.filter((id) => id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(revertedArray));
      throw error;
    }
  };

  return {
    hasLiked,
    handleLike,
    isLoading: mutation.isPending
  };
};
