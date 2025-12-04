import { Route, Routes, Navigate } from "react-router-dom";
import { MapView } from "@features/map/MapView";
import { FirmsView } from "@features/firms/FirmsView";
import { StartupsView } from "@features/startups/StartupsView";
import { SearchView } from "@features/search/SearchView";
import { CommunitiesView } from "@features/communities/CommunitiesView";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<MapView />} />
    <Route path="/firms" element={<FirmsView />} />
    <Route path="/communities" element={<CommunitiesView />} />
    <Route path="/startups" element={<StartupsView />} />
    <Route path="/search" element={<SearchView />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
