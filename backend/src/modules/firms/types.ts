export type Firm = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  fundSize?: string;
  stageFocus?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type FirmFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Firm, "location">;
};
