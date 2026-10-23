
import { useEffect, useState } from "react";
import DashboardContext from "./dashboardContextStore";
import { fetchDashboard, saveDashboard } from "../services/dashboardApi";

const CHART_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function createChartValues() {
    return CHART_LABELS.map(() => Math.floor(Math.random() * 250) + 50);
}

export function DashboardProvider({ children }) {
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [saveMessage, setSaveMessage] = useState("Connecting to the dashboard server...");
    const [isPreview, setIsPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let active = true;
        fetchDashboard()
            .then((dashboard) => {
                if (!Array.isArray(dashboard.elements)) {
                    throw new Error("The server returned an invalid dashboard layout.");
                }
                if (!active) return;
                setElements(dashboard.elements);
                setIsPreview(dashboard.isPreview === true);
                setSaveMessage("Dashboard loaded from MySQL.");
            })
            .catch((error) => {
                if (active) setSaveMessage(`Could not load dashboard: ${error.message}`);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const addElement = (type) => {
        const id = crypto.randomUUID();

        const defaults = {
            text: {
                content: "Edit your text",
                fontSize: 20,
                bold: false,
                italic: false,
            },
            image: {
                content: "",
            },
            section: {
                heading: "New Section",
                backgroundColor: "#f8fafc",
            },
        };

        if (type === "barChart" || type === "lineChart") {
            defaults[type] = {
                title: type === "barChart" ? "Monthly Sales" : "Revenue Trend",
                chartLabels: CHART_LABELS,
                chartValues: createChartValues(),
            };
        }

        if (!Object.hasOwn(defaults, type)) {
            throw new Error(`Unsupported dashboard element type: ${type}`);
        }

        const selectedElement = elements.find((element) => element.id === selectedId);
        const parentSection =
            type !== "section" && selectedElement?.type === "section"
                ? selectedElement
                : null;
        const siblings = elements.filter(
            (element) => (element.parentId ?? null) === (parentSection?.id ?? null)
        );
        const defaultWidth = type === "text" ? 280 : type === "section" ? 440 : 360;
        const defaultHeight = type === "text" ? 120 : type === "section" ? 320 : 240;
        const parentWidth = parentSection ? parentSection.width - 36 : defaultWidth;
        const columnWidth = parentSection
            ? Math.max(40, Math.floor(parentWidth / 2) - 8)
            : defaultWidth;
        const width = parentSection
            ? Math.min(defaultWidth, columnWidth)
            : defaultWidth;
        const height = parentSection
            ? Math.min(defaultHeight, parentSection.height - 88)
            : defaultHeight;
        const row = parentSection ? Math.floor(siblings.length / 2) : 0;
        const x = parentSection ? 8 + (siblings.length % 2) * (columnWidth + 8) : 32;
        const y = parentSection ? 8 + row * (height + 12) : 0;
        const canvasBottom = elements
            .filter((element) => !element.parentId)
            .reduce(
                (bottom, element) => Math.max(bottom, element.y + element.height),
                16
            );
        const newElement = {
            id,
            type,
            ...(parentSection ? { parentId: parentSection.id } : {}),
            x: parentSection ? x : 32,
            y: parentSection ? y : elements.length ? canvasBottom + 24 : 40,
            width,
            height,
            ...defaults[type],
        };

        setElements((prev) => {
            const withNewElement =
                type === "section" ? [newElement, ...prev] : [...prev, newElement];

            if (!parentSection) {
                return withNewElement;
            }

            const requiredHeight = newElement.y + newElement.height + 72;
            return withNewElement.map((element) =>
                element.id === parentSection.id && element.height < requiredHeight
                    ? { ...element, height: requiredHeight }
                    : element
            );
        });
        setSelectedId(id);
    };

    const updateElement = (id, changes) => {
        setElements((prev) =>
            prev.map((element) =>
                element.id === id ? { ...element, ...changes } : element
            )
        );
    };

    const deleteElement = (id) => {
        setElements((prev) =>
            prev.filter((element) => element.id !== id && element.parentId !== id)
        );

        setSelectedId((current) => (current === id ? null : current));
    };

    const moveElement = (id, direction) => {
        setElements((currentElements) => {
            const element = currentElements.find((item) => item.id === id);
            if (!element) return currentElements;

            const siblings = currentElements
                .map((item, index) => ({ item, index }))
                .filter(({ item }) => (item.parentId ?? null) === (element.parentId ?? null));
            const siblingIndex = siblings.findIndex(({ item }) => item.id === id);
            const targetSibling = siblings[siblingIndex + direction];

            if (!targetSibling) {
                return currentElements;
            }

            const reordered = [...currentElements];
            [reordered[siblings[siblingIndex].index], reordered[targetSibling.index]] = [
                reordered[targetSibling.index],
                reordered[siblings[siblingIndex].index],
            ];
            return reordered;
        });
    };

    const saveLayout = async () => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            setSaveMessage("Saving dashboard to MySQL...");
            await saveDashboard(elements);
            setSaveMessage("Dashboard saved to MySQL.");
            setIsPreview(true);
            setSelectedId(null);
        } catch (error) {
            setSaveMessage(`Could not save dashboard: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                elements,
                selectedId,
                saveMessage,
                isPreview,
                isLoading,
                isSaving,
                setSaveMessage,
                setSelectedId,
                setIsPreview,
                addElement,
                updateElement,
                deleteElement,
                moveElement,
                saveLayout,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}
