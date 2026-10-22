import {
    BarChart3,
    ChevronDown,
    ChevronUp,
    Image,
    LayoutGrid,
    LineChart,
    Type,
} from "lucide-react";
import { useDashboard } from "../context/useDashboard";

const items = {
    text: { label: "Text", icon: Type },
    image: { label: "Image", icon: Image },
    barChart: { label: "Bar Chart", icon: BarChart3 },
    lineChart: { label: "Line Chart", icon: LineChart },
    section: { label: "Section", icon: LayoutGrid },
};

export default function Sidebar() {
    const { addElement, elements, selectedId, setSelectedId, moveElement } = useDashboard();

    const renderLayers = (parentId = null, level = 0) => {
        const siblings = elements.filter(
            (element) => (element.parentId ?? null) === parentId
        );

        return [...siblings].reverse().map((element) => {
            const item = items[element.type] ?? items.section;
            const Icon = item.icon;
            const index = siblings.findIndex(({ id }) => id === element.id);
            const label = element.heading || item.label;

            return (
                <div key={element.id}>
                    <div
                        className={`layer-row ${selectedId === element.id ? "active" : ""}`}
                        style={{ paddingLeft: `${level * 12}px` }}
                    >
                        <button
                            type="button"
                            className="layer-select"
                            onClick={() => setSelectedId(element.id)}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </button>
                        <div className="layer-order">
                            <button
                                type="button"
                                title="Bring forward"
                                aria-label={`Bring ${label} forward`}
                                disabled={index === siblings.length - 1}
                                onClick={() => moveElement(element.id, 1)}
                            >
                                <ChevronUp size={14} />
                            </button>
                            <button
                                type="button"
                                title="Send backward"
                                aria-label={`Send ${label} backward`}
                                disabled={index === 0}
                                onClick={() => moveElement(element.id, -1)}
                            >
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                    {renderLayers(element.id, level + 1)}
                </div>
            );
        });
    };

    return (
        <aside className="sidebar">
            <div className="panel-heading">Elements</div>
            <p className="panel-description">Add components to your dashboard</p>

            <div className="element-list">
                {Object.entries(items).map(([type, { label, icon: Icon }]) => (
                    <button
                        key={type}
                        className="element-button"
                        onClick={() => addElement(type)}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            <div className="panel-heading layers-heading">Layers</div>
            {elements.length === 0 ? (
                <p className="panel-description">Added elements will appear here.</p>
            ) : (
                <div className="layer-list">{renderLayers()}</div>
            )}
        </aside>
    );
}
