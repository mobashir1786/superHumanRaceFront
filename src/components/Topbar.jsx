
import { Save, Undo2, Redo2, LayoutDashboard } from "lucide-react";
import { useDashboard } from "../context/useDashboard";

export default function Topbar() {
    const { saveLayout, saveMessage } = useDashboard();

    return (
        <header className="topbar">
            <div className="brand">
                <LayoutDashboard size={22} />
                <span>Dashboard Builder</span>
            </div>

            <div className="topbar-actions">
                <button className="icon-button" title="Undo" disabled>
                    <Undo2 size={18} />
                </button>

                <button className="icon-button" title="Redo" disabled>
                    <Redo2 size={18} />
                </button>

                <button
                    className="save-button"
                    onClick={saveLayout}
                    title="Save layout in this browser"
                >
                    <Save size={16} />
                    Save Layout
                </button>
            </div>
            <span className="topbar-status" role="status" aria-live="polite">
                {saveMessage || "Browser-only saving - no backend"}
            </span>
        </header>
    );
}
