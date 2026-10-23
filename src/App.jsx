
import { useEffect, useState } from "react";
import { DashboardProvider } from "./context/DashboardContext.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import DashboardCanvas from "./components/DashboardCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import { useDashboard } from "./context/useDashboard";
import {
  clearAccessToken,
  getAccessToken,
  loginDashboard,
} from "./services/dashboardApi";
import "./App.css";

function DashboardEditor({ onLogout }) {
  const { isPreview } = useDashboard();

  return (
    <div className={`app-shell ${isPreview ? "preview-app-shell" : ""}`}>
      <Topbar onLogout={onLogout} />

      <div className={`editor-layout ${isPreview ? "dashboard-view-layout" : ""}`}>
        {!isPreview && <Sidebar />}

        <main className={`canvas-area ${isPreview ? "preview-canvas-area" : ""}`}>
          <DashboardCanvas />
        </main>

        {!isPreview && <PropertiesPanel />}
      </div>
    </div>
  );
}

function SignIn({ onSignIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await loginDashboard(password);
      onSignIn();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="sign-in-page">
      <form className="sign-in-card" onSubmit={handleSubmit}>
        <div className="sign-in-icon" aria-hidden="true">DB</div>
        <h1>Dashboard Builder</h1>
        <p>Enter your dashboard password to continue.</p>
        <label htmlFor="dashboard-password">Password</label>
        <input
          autoComplete="current-password"
          autoFocus
          id="dashboard-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        {error && <p className="sign-in-error" role="alert">{error}</p>}
        <button className="save-button sign-in-submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function AuthenticatedApp() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    const handleExpired = () => setAuthenticated(false);
    window.addEventListener("dashboard-auth-expired", handleExpired);
    return () => window.removeEventListener("dashboard-auth-expired", handleExpired);
  }, []);

  if (!authenticated) {
    return <SignIn onSignIn={() => setAuthenticated(true)} />;
  }

  const logout = () => {
    clearAccessToken();
    setAuthenticated(false);
  };

  return (
    <DashboardProvider>
      <DashboardEditor onLogout={logout} />
    </DashboardProvider>
  );
}

export default function App() {
  return <AuthenticatedApp />;
}
