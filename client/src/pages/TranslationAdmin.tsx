import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TranslationAdmin.scss";
const URL = import.meta.env.VITE_ADDRESS;

// Define the Translation interface for TypeScript
interface Translation {
    _id: string;
    title: string;
    contentType: string;
}

const axiosInstance = axios.create({
    baseURL: URL,
});

const TranslationsDashboard: React.FC = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing translations
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await axiosInstance.get("/translations/all");
                setTranslations(response.data);
            } catch (error) {
                console.error("Error fetching translations:", error);
                setError("Failed to fetch translations.");
            } finally {
                setLoading(false);
            }
        };
        fetchTranslations();
    }, []);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    // Handle form submission to add or update a translation
    const handleSubmitTranslation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("pdf", file);

        try {
            if (editMode && selectedTranslation) {
                // Update existing translation
                await axiosInstance.put(`/translations/update/${selectedTranslation._id}`, formData);
                setTranslations(
                    translations.map((trans) =>
                        trans._id === selectedTranslation._id ? { ...trans, title } : trans
                    )
                );
            } else {
                // Create new translation
                const response = await axiosInstance.post("/translations/upload", formData);
                setTranslations([...translations, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving translation:", error);
            setError("Failed to save translation.");
        }
    };

    // Reset form fields and exit edit mode
    const resetForm = () => {
        setTitle("");
        setFile(null);
        setEditMode(false);
        setSelectedTranslation(null);
    };

    // Select a translation for editing
    const handleEditTranslation = (translationId: string) => {
        const translation = translations.find((t) => t._id === translationId);
        if (translation) {
            setTitle(translation.title);
            setSelectedTranslation(translation);
            setEditMode(true);
        }
    };

    // Handle translation deletion
    const handleDeleteTranslation = async () => {
        if (selectedTranslation) {
            try {
                await axiosInstance.delete(`/translations/delete/${selectedTranslation._id}`);
                setTranslations(translations.filter((trans) => trans._id !== selectedTranslation._id));
                resetForm();
            } catch (error) {
                console.error("Error deleting translation:", error);
                setError("Failed to delete translation.");
            }
        }
    };

    return (
        <div className="translations-dashboard">
            <h2>{editMode ? "Edit Translation" : "Add New Translation"}</h2>

            {/* Form to Add or Edit Translation */}
            <form onSubmit={handleSubmitTranslation}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input type="file" accept="application/pdf" onChange={handleFileChange} required={!editMode} />
                <div className="button-container">
                    <button type="submit">{editMode ? "Update Translation" : "Add Translation"}</button>
                    <button
                        type="button"
                        className="reset-button"
                        onClick={() => resetForm()}
                    >
                        Reset
                    </button>
                </div>
            </form>

            {/* Translation Management */}
            <div className="translation-management">
                <h3>Manage Translations</h3>
                <select
                    value={selectedTranslation?._id || ""}
                    onChange={(e) => handleEditTranslation(e.target.value)}
                >
                    <option value="">Select a translation</option>
                    {translations.map((translation) => (
                        <option key={translation._id} value={translation._id}>
                            {translation.title}
                        </option>
                    ))}
                </select>

                {selectedTranslation && (
                    <div className="translation-actions">
                        <button onClick={resetForm}>Cancel Edit</button>
                        <button onClick={handleDeleteTranslation}>Delete Translation</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranslationsDashboard;