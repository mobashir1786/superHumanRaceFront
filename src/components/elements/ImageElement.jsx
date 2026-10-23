
import { useRef } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { useDashboard } from "../../context/useDashboard";

export default function ImageElement({ element }) {
    const fileInputRef = useRef(null);
    const { updateElement, isPreview } = useDashboard();

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be 5 MB or less.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                alert("The selected image could not be read.");
                return;
            }

            updateElement(element.id, {
                content: reader.result,
                alt: file.name,
                fileName: file.name,
            });
        };
        reader.onerror = () => alert("The selected image could not be read.");

        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const removeImage = () => {
        updateElement(element.id, {
            content: "",
            alt: "Uploaded image",
            fileName: "",
        });
    };

    return (
        <div className="image-element">
            {element.content ? (
                <>
                    <img
                        src={element.content}
                        alt={element.alt || "Uploaded image"}
                        className="uploaded-image"
                        draggable={false}
                    />

                    {!isPreview && (
                        <div className="image-actions">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={15} />
                                Replace
                            </button>

                            <button type="button" onClick={removeImage}>
                                <X size={15} />
                                Remove
                            </button>
                        </div>
                    )}
                </>
            ) : !isPreview ? (
                <button
                    type="button"
                    className="image-upload-placeholder"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImagePlus size={30} />
                    <strong>Upload an image</strong>
                    <span>PNG, JPG, GIF or WebP</span>
                    <span>Maximum size: 5 MB</span>
                </button>
            ) : (
                <div className="image-preview-empty">No image selected</div>
            )}

            {!isPreview && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                />
            )}
        </div>
    );
}
