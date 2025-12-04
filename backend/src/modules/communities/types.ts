export type Community = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  category?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type CommunityFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Community, "location">;
};

export type CreateCommunityInput = {
  name: string;
  website?: string;
  description?: string;
  tags?: string[];
  category?: string;
  latitude: number;
  longitude: number;
  address?: string;
};
