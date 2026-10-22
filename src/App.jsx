
import { DashboardProvider } from "./context/DashboardContext.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import DashboardCanvas from "./components/DashboardCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import "./App.css";

function DashboardEditor() {
  return (
    <div className="app-shell">
      <Topbar />

      <div className="editor-layout">
        <Sidebar />

        <main className="canvas-area">
          <DashboardCanvas />
        </main>

        <PropertiesPanel />
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
