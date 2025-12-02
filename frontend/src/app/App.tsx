import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import { BrowserRouter, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HealthBanner } from "@components/HealthBanner";

export const App = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <div className="min-h-screen bg-cloud text-night">
          <Toaster position="top-right" />
          <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
            <HealthBanner />
            <header className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold">Houston Mapping</h1>
                <p className="text-slate-600">
                  VC firms and startups mapped for the Rice Residency hacker house.
                </p>
              </div>
              <nav className="flex gap-3 text-sm text-slate-700 font-medium">
                <Link className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50" to="/">
                  Map
                </Link>
                <Link
                  className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50"
                  to="/firms"
                >
                  Firms
                </Link>
                <Link
                  className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50"
                  to="/startups"
                >
                  Startups
                </Link>
                <Link
                  className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50"
                  to="/search"
                >
                  Search
                </Link>
              </nav>
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
