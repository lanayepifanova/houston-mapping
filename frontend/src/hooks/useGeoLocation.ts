import { useEffect, useState } from "react";

type GeoLocation = {
  lat: number;
  lng: number;
} | null;

type GeoStatus = "idle" | "loading" | "error" | "success";

type GeoError = string | null;

export const useGeoLocation = () => {
  const [location, setLocation] = useState<GeoLocation>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [error, setError] = useState<GeoError>(null);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("success");
      },
      (err) => {
        setError(err.message);
        setStatus("error");
      }
    );
  }, []);

  return { location, status, error };
};
