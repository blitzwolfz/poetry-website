import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Poem {
    _id: string;
    title: string;
    contentEnglish: string;
    contentGreek: string;
}

const PoemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Get the poem ID from the URL
    const [poem, setPoem] = useState<Poem | null>(null);  // State to store poem data
    const [loading, setLoading] = useState<boolean>(true);  // State to show loading indicator
    const [error, setError] = useState<string | null>(null);  // State for error handling
    const [language, setLanguage] = useState<string>('english');  // State to toggle between languages
    console.log('Poem fetched:');

    // Fetch the individual poem by ID
    useEffect(() => {
        const fetchPoem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/poetry/${id}`);
                console.log('Poem fetched:', response.data);
                setPoem(response.data);  // Set the poem data in state
            } catch (error) {
                console.error('Error fetching poem:', error);
                setError('Failed to fetch poem');
            } finally {
                setLoading(false);  // Stop the loading indicator
            }
        };

        fetchPoem();
    }, [id]);

    // Handle language toggle
    const handleToggleLanguage = () => {
        setLanguage(prevLang => (prevLang === 'english' ? 'greek' : 'english'));
    };

    if (loading) {
        return <p>Loading poem...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!poem) {
        return <p>Poem not found.</p>;
    }

    return (
        <div className="poem-detail">
            <h2>{poem.title}</h2>
            {language === 'english' ? (
                <>
                    <h3>English Version</h3>
                    <p>{poem.contentEnglish}</p>
                </>
            ) : (
                <>
                    <h3>Greek Version</h3>
                    <p>{poem.contentGreek}</p>
                </>
            )}
            <button onClick={handleToggleLanguage}>
                {language === 'english' ? 'Switch to Greek' : 'Switch to English'}
            </button>
        </div>
    );
};

export default PoemDetail;
