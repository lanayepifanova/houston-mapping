import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const createClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30
      }
    }
  });

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [client] = useState(createClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
