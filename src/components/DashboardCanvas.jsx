import { Rnd } from "react-rnd";
import { useDashboard } from "../context/useDashboard";
import ChartElement from "./elements/ChartElement";
import ImageElement from "./elements/ImageElement";
import TextElement from "./elements/TextElement";

const chartTypes = ["barChart", "lineChart"];

function renderElementContent(element, elements) {
    if (element.type === "text") {
        return <TextElement element={element} />;
    }

    if (element.type === "image") {
        return <ImageElement element={element} />;
    }

    if (element.type === "section") {
        const children = elements.filter((item) => item.parentId === element.id);

        return (
            <>
                {element.heading && <h3 className="element-heading">{element.heading}</h3>}
                <div className="section-content">
                    {children.length ? (
                        children.map((child, index) => (
                            <CanvasElement
                                key={child.id}
                                element={child}
                                elements={elements}
                                index={index}
                            />
                        ))
                    ) : (
                        <div className="section-placeholder">
                            Select this section, then add an element to place it here
                        </div>
                    )}
                </div>
            </>
        );
    }

    if (chartTypes.includes(element.type)) {
        return (
            <>
                {element.heading && <h3 className="element-heading">{element.heading}</h3>}
                <ChartElement element={element} />
            </>
        );
    }

    return (
        <>
            <div className="section-placeholder">Unsupported element type</div>
        </>
    );
}

function CanvasElement({ element, elements, index }) {
    const { selectedId, setSelectedId, updateElement, isPreview } = useDashboard();

    if (isPreview) {
        return (
            <div
                className="dashboard-element-preview"
                style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    order: element.y,
                    zIndex: index + 1,
                }}
            >
                <div
                    className={`canvas-element element-${element.type} ${element.type === "section" ? "section-element" : ""
                        } ${chartTypes.includes(element.type) ? "chart-canvas-element" : ""}`}
                    style={
                        element.type === "section"
                            ? { backgroundColor: element.backgroundColor || "#f8fafc" }
                            : undefined
                    }
                >
                    {renderElementContent(element, elements)}
                </div>
            </div>
        );
    }

    return (
        <Rnd
            key={element.id}
            bounds="parent"
            position={{ x: element.x, y: element.y }}
            size={{ width: element.width, height: element.height }}
            minWidth={element.type === "section" ? 240 : 40}
            minHeight={element.type === "section" ? 160 : 40}
            enableResizing={selectedId === element.id}
            resizeHandleStyles={{
                bottomRight: {
                    width: 12,
                    height: 12,
                    right: -6,
                    bottom: -6,
                    backgroundColor: "#2563eb",
                    border: "2px solid white",
                    borderRadius: "50%",
                },
            }}
            cancel="button, input, textarea, select"
            onDragStart={() => setSelectedId(element.id)}
            onDragStop={(_event, position) =>
                updateElement(element.id, { x: position.x, y: position.y })
            }
            onResizeStop={(_event, _direction, ref, _delta, position) =>
                updateElement(element.id, {
                    x: position.x,
                    y: position.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                })
            }
            className="canvas-element-wrapper"
            style={{ zIndex: index + 1 }}
            onClick={(event) => {
                event.stopPropagation();
                setSelectedId(element.id);
            }}
        >
            <div
                className={`canvas-element element-${element.type} ${element.type === "section" ? "section-element" : ""
                    } ${chartTypes.includes(element.type) ? "chart-canvas-element" : ""
                    } ${selectedId === element.id ? "selected" : ""}`}
                style={
                    element.type === "section"
                        ? { backgroundColor: element.backgroundColor || "#f8fafc" }
                        : undefined
                }
            >
                {renderElementContent(element, elements)}
            </div>
        </Rnd>
    );
}

export default function DashboardCanvas() {
    const { elements, setSelectedId, isPreview } = useDashboard();
    const topLevelElements = elements.filter((element) => !element.parentId);
    const contentBottom = topLevelElements.reduce(
        (bottom, element) => Math.max(bottom, element.y + element.height + 32),
        0
    );

    return (
        <div
            className={`dashboard-canvas ${isPreview ? "dashboard-preview" : ""}`}
            style={
                topLevelElements.length
                    ? { minHeight: `max(calc(100vh - 112px), ${contentBottom}px)` }
                    : undefined
            }
            onClick={() => {
                if (!isPreview) setSelectedId(null);
            }}
        >
            {topLevelElements.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">+</div>
                    <h2>Your dashboard starts here</h2>
                    <p>
                        {isPreview
                            ? "This dashboard is ready for your content."
                            : "Add a text, image, chart, or section using the left sidebar."}
                    </p>
                </div>
            ) : (
                topLevelElements.map((element, index) => (
                    <CanvasElement
                        key={element.id}
                        element={element}
                        elements={elements}
                        index={index}
                    />
                ))
            )}
        </div>
    );
}
