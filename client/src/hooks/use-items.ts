import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useItems(search?: string) {
  return useQuery({
    queryKey: [api.items.list.path, search],
    queryFn: async () => {
      const url = search 
        ? `${api.items.list.path}?search=${encodeURIComponent(search)}` 
        : api.items.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar itens");
      return api.items.list.responses[200].parse(await res.json());
    },
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: [api.items.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.items.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Falha ao carregar item");
      return api.items.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertItem) => {
      const res = await fetch(api.items.create.path, {
        method: api.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.items.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Falha ao criar item");
      }
      return api.items.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Item criado com sucesso",
        description: "O novo item foi adicionado ao estoque.",
        className: "bg-primary text-primary-foreground border-none"
      });
    },
  });
}

export function useBulkCreateItems() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertItem[]) => {
      const res = await fetch(api.items.bulkCreate.path, {
        method: api.items.bulkCreate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Falha ao importar itens");
      return api.items.bulkCreate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Importação concluída",
        description: "Os itens foram carregados com sucesso.",
        className: "bg-primary text-primary-foreground border-none"
      });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertItem>) => {
      const url = buildUrl(api.items.update.path, { id });
      const res = await fetch(url, {
        method: api.items.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.items.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Falha ao atualizar item");
      }
      return api.items.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Item atualizado",
        description: "As informações foram salvas.",
        className: "bg-primary text-primary-foreground border-none"
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.items.delete.path, { id });
      const res = await fetch(url, { method: api.items.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Falha ao deletar item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Item removido",
        description: "O item foi removido do sistema.",
      });
    },
  });
}

export function useDuplicateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.items.duplicate.path, { id });
      const res = await fetch(url, {
        method: api.items.duplicate.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao duplicar item");
      return api.items.duplicate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({
        title: "Item duplicado",
        description: "Uma cópia do item foi criada.",
        className: "bg-primary text-primary-foreground border-none"
      });
    },
  });
}
