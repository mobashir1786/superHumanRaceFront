
import { RefreshCw } from "lucide-react";
import { useDashboard } from "../context/useDashboard";

export default function PropertiesPanel() {
    const {
        elements,
        selectedId,
        updateElement,
        deleteElement,
    } = useDashboard();

    const selectedElement = elements.find(
        (element) => element.id === selectedId
    );

    if (!selectedElement) {
        return (
            <aside className="properties-panel">
                <div className="panel-heading">Properties</div>
                <p className="panel-description">
                    Select an element to edit its properties.
                </p>
            </aside>
        );
    }

    const update = (key, value) => {
        updateElement(selectedId, { [key]: value });
    };

    const isText = selectedElement.type === "text";
    const isChart = ["barChart", "lineChart"].includes(
        selectedElement.type
    );
    const isSection = selectedElement.type === "section";

    const updateChartValue = (index, value) => {
        const chartValues = [...(selectedElement.chartValues ?? [])];
        chartValues[index] = Math.max(0, Number(value) || 0);
        update("chartValues", chartValues);
    };

    const regenerateChartData = () => {
        update(
            "chartValues",
            (selectedElement.chartLabels ?? []).map(
                () => Math.floor(Math.random() * 250) + 50
            )
        );
    };

    return (
        <aside className="properties-panel">
            <div className="panel-heading">Properties</div>

            <label className="field-label">
                Element type
                <input value={selectedElement.type} readOnly />
            </label>

            <label className="field-label">
                Element heading
                <input
                    type="text"
                    value={selectedElement.heading ?? ""}
                    placeholder="Enter element heading"
                    onChange={(e) => update("heading", e.target.value)}
                />
            </label>

            {isText && (
                <>
                    <label className="field-label">
                        Text content
                        <textarea
                            value={selectedElement.content ?? ""}
                            onChange={(e) => update("content", e.target.value)}
                            placeholder="Enter your text"
                        />
                    </label>

                    <label className="field-label">
                        Font size (px)
                        <input
                            type="number"
                            min="8"
                            max="96"
                            value={selectedElement.fontSize ?? 20}
                            onChange={(e) =>
                                update("fontSize", Math.min(96, Math.max(8, Number(e.target.value) || 8)))
                            }
                        />
                    </label>

                    <div className="text-format-toolbar" role="group" aria-label="Text formatting">
                        <button
                            type="button"
                            className={selectedElement.bold ? "active" : ""}
                            aria-pressed={Boolean(selectedElement.bold)}
                            onClick={() => update("bold", !selectedElement.bold)}
                        >
                            Bold
                        </button>
                        <button
                            type="button"
                            className={selectedElement.italic ? "active" : ""}
                            aria-pressed={Boolean(selectedElement.italic)}
                            onClick={() => update("italic", !selectedElement.italic)}
                        >
                            Italic
                        </button>
                    </div>
                </>
            )}

            {isChart && (
                <>
                    <label className="field-label">
                        Chart title
                        <input
                            type="text"
                            value={selectedElement.title ?? ""}
                            onChange={(e) => update("title", e.target.value)}
                            placeholder="Enter chart title"
                        />
                    </label>

                    <div className="chart-values">
                        <div className="chart-values-heading">
                            <span>Sample data</span>
                            <button type="button" onClick={regenerateChartData} title="Generate new sample data">
                                <RefreshCw size={14} />
                                Regenerate
                            </button>
                        </div>
                        {(selectedElement.chartLabels ?? []).map((label, index) => (
                            <label className="chart-value-row" key={`${label}-${index}`}>
                                {label}
                                <input
                                    type="number"
                                    min="0"
                                    value={selectedElement.chartValues?.[index] ?? 0}
                                    onChange={(event) =>
                                        updateChartValue(index, event.target.value)
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </>
            )}

            {isSection && (
                <label className="field-label">
                    Section background
                    <input
                        type="color"
                        value={selectedElement.backgroundColor ?? "#f8fafc"}
                        onChange={(event) => update("backgroundColor", event.target.value)}
                    />
                </label>
            )}

            <div className="property-grid">
                {["x", "y", "width", "height"].map((key) => (
                    <label key={key} className="field-label">
                        {key.toUpperCase()}
                        <input
                            type="number"
                            min={
                                selectedElement.type === "section"
                                    ? key === "width" ? 240 : key === "height" ? 160 : 0
                                    : key === "width" || key === "height" ? 40 : 0
                            }
                            value={selectedElement[key]}
                            onChange={(e) =>
                                update(
                                    key,
                                    Math.max(
                                        selectedElement.type === "section"
                                            ? key === "width" ? 240 : key === "height" ? 160 : 0
                                            : key === "width" || key === "height" ? 40 : 0,
                                        Number(e.target.value) || 0
                                    )
                                )
                            }
                        />
                    </label>
                ))}
            </div>
            {selectedElement.parentId && (
                <p className="panel-description element-parent-note">
                    Position is relative to its parent section.
                </p>
            )}

            <button
                className="delete-button"
                onClick={() => deleteElement(selectedId)}
            >
                Delete element
            </button>
        </aside>
    );
}
