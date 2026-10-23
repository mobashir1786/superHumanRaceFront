
import { DashboardProvider } from "./context/DashboardContext.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import DashboardCanvas from "./components/DashboardCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import { useDashboard } from "./context/useDashboard";
import "./App.css";

function DashboardEditor() {
  const { isPreview } = useDashboard();

  return (
    <div className={`app-shell ${isPreview ? "preview-app-shell" : ""}`}>
      <Topbar />

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

export default function App() {
  return (
    <DashboardProvider>
      <DashboardEditor />
    </DashboardProvider>
  );
}
