import { endpoint } from "@/config/endpoint";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

const queries = [
  { key: "today", endpoint: endpoint.GET_CHAT.TODAY },
  { key: "yesterday", endpoint: endpoint.GET_CHAT.YESTERDAY },
  { key: "past-7-days", endpoint: endpoint.GET_CHAT.THIS_WEEK },
  { key: "past-30-days", endpoint: endpoint.GET_CHAT.THIS_MONTH },
];

// ---- React Queries
const useChatQueries = () => {
  return useQueries({
    queries: queries.map(({ key, endpoint }) => ({
      queryKey: ["sidebar-all-chat", key],
      queryFn: async () => {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${key} chats`);
        }
        return await response.json();
      },
      staleTime: Infinity,
    })),
  });
};

// ---- Mutations
interface ChatUpdatePayload {
  rename?: string;
  archived?: boolean;
  favorite?: boolean;
}

interface ChatUpdateResponse {
  detail: string;
  success: boolean;
  session_id: string;
  updated_fields: {
    session_name: string;
    archived: boolean;
    favorite: boolean;
  };
}

const useChatUpdateMutation = () => {
  const queryClient = useQueryClient();

  // --- Hooks
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["sidebar-chat-update"],
    mutationFn: async ({
      session_id,
      payload,
    }: {
      session_id: string;
      payload: ChatUpdatePayload;
    }) => {
      const response = await fetch(`${endpoint.UPDATE_CHAT}/${session_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update chat session");
      }

      return (await response.json()) as unknown as ChatUpdateResponse;
    },
    onSuccess: (data: ChatUpdateResponse) => {
      if (data.success) {
        queries.forEach((query) => {
          queryClient.invalidateQueries({
            queryKey: ["sidebar-all-chat", query.key],
          });
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating chat",
        description: error.message,
      });
    },
  });
};

const useChatDeleteMutation = () => {
  const queryClient = useQueryClient();

  // --- Hooks
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["sidebar-chat-update"],
    mutationFn: async ({
      session_id,
      payload,
    }: {
      session_id: string;
      payload: ChatUpdatePayload;
    }) => {
      const response = await fetch(`${endpoint.UPDATE_CHAT}/${session_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update chat session");
      }

      return (await response.json()) as unknown as ChatUpdateResponse;
    },
    onSuccess: (data: ChatUpdateResponse) => {
      if (data.success) {
        queries.forEach((query) => {
          queryClient.invalidateQueries({
            queryKey: ["sidebar-all-chat", query.key],
          });
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating chat",
        description: error.message,
      });
    },
  });
};

export const useChatData = () => {
  const results = useChatQueries();
  const updateMutation = useChatUpdateMutation();
  const deleteMutation = useChatDeleteMutation();

  return { queries, results, updateMutation, deleteMutation };
};
