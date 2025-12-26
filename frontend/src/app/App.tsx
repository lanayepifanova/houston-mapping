import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import { BrowserRouter, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HealthBanner } from "@components/HealthBanner";

export const App = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-pill ${isActive ? "nav-pill-active" : ""}`;

  return (
    <AppProviders>
      <BrowserRouter>
        <div className="min-h-screen app-shell">
          <Toaster position="top-right" />
          <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
            <HealthBanner />
            <header className="app-hero px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4 max-w-2xl animate-rise">
                  <span className="badge">Houston ecosystem atlas</span>
                  <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl text-neutral-900">
                      Houston Mapping
                    </h1>
                    <p className="text-sm text-neutral-700 sm:text-base sm:leading-relaxed">
                      VC firms, startups, and communities mapped for the Rice Residency
                      hacker house. Browse the city by tags, stages, and guides.
                    </p>
                  </div>
                </div>
                <nav className="flex gap-2 text-xs font-semibold text-neutral-700 animate-rise-delayed overflow-x-auto whitespace-nowrap pb-2 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:text-sm">
                  <NavLink className={navClass} to="/" end>
                    Map
                  </NavLink>
                  <NavLink className={navClass} to="/firms">
                    Firms
                  </NavLink>
                  <NavLink className={navClass} to="/communities">
                    Communities
                  </NavLink>
                  <NavLink className={navClass} to="/startups">
                    Startups
                  </NavLink>
                  <NavLink className={navClass} to="/guides">
                    Guides
                  </NavLink>
                </nav>
              </div>
            </header>
            <main>
              <AppRouter />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProviders>
  );
};
