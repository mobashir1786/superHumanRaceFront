export default function TextElement({ element }) {
    return (
        <>
            {element.heading && <h3 className="element-heading">{element.heading}</h3>}
            <p
                className="text-element-content"
                style={{
                    fontSize: `${element.fontSize ?? 20}px`,
                    fontWeight: element.bold ? "bold" : "normal",
                    fontStyle: element.italic ? "italic" : "normal",
                }}
            >
                {element.content || "Edit your text"}
            </p>
        </>
    );
}
