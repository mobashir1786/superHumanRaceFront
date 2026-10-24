
import { Save, LayoutDashboard, Pencil } from "lucide-react";
import { useDashboard } from "../context/useDashboard";

export default function Topbar() {
    const {
        saveLayout,
        saveMessage,
        isPreview,
        isLoading,
        isSaving,
        setIsPreview,
    } = useDashboard();

    return (
        <header className="topbar">
            <div className="brand">
                <LayoutDashboard size={22} />
                <span>{isPreview ? "Dashboard" : "Dashboard Builder"}</span>
            </div>

            <div className="topbar-actions">
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
                        disabled={isLoading || isSaving}
                        title="Save layout and open dashboard view"
                    >
                        <Save size={16} />
                        Save &amp; View Dashboard
                    </button>
                )}
            </div>
            {!isPreview && (
                <span className="topbar-status" role="status" aria-live="polite">
                    {saveMessage}
                </span>
            )}
        </header>
    );
}
