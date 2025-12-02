export type Startup = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  stage?: string;
  industry?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type StartupFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Startup, "location">;
};

export type CreateStartupInput = {
  name: string;
  website?: string;
  description?: string;
  tags?: string[];
  stage?: string;
  industry?: string;
  latitude: number;
  longitude: number;
  address?: string;
};
