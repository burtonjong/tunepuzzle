"use client";

import React from "react";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export default function Provider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: true,
            initialDataUpdatedAt: 0,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error("Query Boundary Caught:", error);
          },
          onSuccess(data, query) {
            console.log(data, query);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, variables, context, mutation) => {
            console.error("Mutation Boundary Caught:", error);
          },
          onSuccess(data, variables, context, mutation) {
            console.log(data, variables, context, mutation);
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
