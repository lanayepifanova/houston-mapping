import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@services/api";

export const HealthBanner = () => {
  const { isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiGet<{ status: string }>("/health"),
    retry: 1,
    refetchInterval: 1000 * 15
  });

  if (!isError) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
      Backend unreachable. Ensure the API server is running and CORS allows this origin.
    </div>
  );
};
