import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data stays fresh before refetching
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache time: how long unused data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      // Retry failed requests 3 times
      retry: 3,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
