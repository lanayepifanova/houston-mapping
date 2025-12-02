import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import "./shell.css";

export const App = () => {
  return (
    <AppProviders>
      <div className="app-shell">
        <header className="app-header">
          <h1>Houston Mapping</h1>
          <p>VC firms and startups mapped for Rice Residency.</p>
        </header>
        <main className="app-main">
          <AppRouter />
        </main>
      </div>
    </AppProviders>
  );
};
