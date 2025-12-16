import { useQuery } from "@tanstack/react-query";
const BACKEND_HEALTH_URL = import.meta.env.VITE_BACKEND_HEALTH_URL;

export const HealthBanner = () => {
  // In the static deployment we don't have a backend; only run the health check if a URL is provided.
  if (!BACKEND_HEALTH_URL) return null;

  const fetchHealth = async () => {
    const res = await fetch(BACKEND_HEALTH_URL);
    if (!res.ok) throw new Error("Health check failed");
    return res.json() as Promise<{ status: string }>;
  };

  const { isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: 1,
    refetchInterval: 1000 * 15,
    enabled: Boolean(BACKEND_HEALTH_URL)
  });

  if (!isError) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
      Backend unreachable. Ensure the API server is running and CORS allows this origin.
    </div>
  );
};
