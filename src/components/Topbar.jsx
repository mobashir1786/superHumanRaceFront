
import { Save, Undo2, Redo2, LayoutDashboard, Pencil } from "lucide-react";
import { useDashboard } from "../context/useDashboard";

export default function Topbar() {
    const { saveLayout, saveMessage, isPreview, setIsPreview } = useDashboard();

    return (
        <header className="topbar">
            <div className="brand">
                <LayoutDashboard size={22} />
                <span>{isPreview ? "Dashboard" : "Dashboard Builder"}</span>
            </div>

            <div className="topbar-actions">
                {!isPreview && (
                    <>
                        <button className="icon-button" title="Undo" disabled>
                            <Undo2 size={18} />
                        </button>

                        <button className="icon-button" title="Redo" disabled>
                            <Redo2 size={18} />
                        </button>
                    </>
                )}

                {isPreview ? (
                    <button
                        className="save-button"
                        onClick={() => setIsPreview(false)}
                        title="Return to dashboard editor"
                    >
                        <Pencil size={16} />
                        Edit Dashboard
                    </button>
                ) : (
                    <button
                        className="save-button"
                        onClick={saveLayout}
                        title="Save layout and open dashboard view"
                    >
                        <Save size={16} />
                        Save &amp; View Dashboard
                    </button>
                )}
            </div>
            {!isPreview && (
                <span className="topbar-status" role="status" aria-live="polite">
                    {saveMessage || "Browser-only saving - no backend"}
                </span>
            )}
        </header>
    );
}
