import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.scss';

// Define the Poem interface for TypeScript
interface Poem {
    _id: string;
    title: string;
    contentEnglish: string;
    contentGreek: string;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
});

const AdminDashboard: React.FC = () => {
    const [poems, setPoems] = useState<Poem[]>([]); // Initialize as an empty array
    const [newPoem, setNewPoem] = useState({
        title: '',
        contentEnglish: '',
        contentGreek: ''
    });
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Error handling

    // Fetch existing poems from the API
    useEffect(() => {
        const fetchPoems = async () => {
            try {
                const response = await axiosInstance.get('/poetry');
                console.log('Poems fetched:', response.data); // For debugging

                if (Array.isArray(response.data)) {
                    setPoems(response.data); // Set poems if response is valid
                } else {
                    setError('Invalid response format from the server.');
                }
            } catch (error) {
                console.error('Error fetching poems:', error);
                setError('Failed to fetch poems.');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchPoems();
    }, []);

    // Handle input change for the new poem form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewPoem({ ...newPoem, [e.target.name]: e.target.value });
    };

    // Handle form submission to add a new poem
    const handleAddPoem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/poetry', newPoem);
            setPoems([...poems, response.data]); // Add the new poem to the list
            setNewPoem({ title: '', contentEnglish: '', contentGreek: '' }); // Clear the form
        } catch (error) {
            console.error('Error adding poem:', error);
            setError(error+' Failed to add poem.');
        }
    };

    // Handle poem deletion
    const handleDeletePoem = async (id: string) => {
        try {
            await axiosInstance.delete(`/poetry/${id}`);
            setPoems(poems.filter(poem => poem._id !== id)); // Remove the deleted poem from the list
        } catch (error) {
            console.error('Error deleting poem:', error);
            setError(error+' Failed to delete poem.');
        }
    };

    // Display error message, loading state, or the main dashboard
    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {/* Display loading or error */}
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Add new poem form */}
            <div className="post-editor">
                <h3>Add New Poem</h3>
                <form onSubmit={handleAddPoem}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newPoem.title}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="contentEnglish"
                        placeholder="Poem in English"
                        value={newPoem.contentEnglish}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="contentGreek"
                        placeholder="Poem in Greek"
                        value={newPoem.contentGreek}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Poem</button>
                </form>
            </div>

            {/* Display the list of existing poems */}
            <div className="post-list">
                <h3>Existing Poems</h3>
                {poems.length > 0 ? (
                    <ul>
                        {poems.map(poem => (
                            <li key={poem._id}>
                                <div>
                                    <strong>{poem.title}</strong>
                                    <p>English: {poem.contentEnglish.slice(0, 100)}...</p>
                                    <p>Greek: {poem.contentGreek.slice(0, 100)}...</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleDeletePoem(poem._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>No poems are available yet.</p> // Only show this when not loading
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
