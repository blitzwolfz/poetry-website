import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PoetryLanding.scss'; // Assuming this SCSS file contains the styles

interface Poem {
    _id: string;
    title: string;
    contentEnglish: string;
    contentGreek: string;
}

const PoetryLanding: React.FC = () => {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch poems from the API
    useEffect(() => {
        const fetchPoems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/poetry');
                if (Array.isArray(response.data)) {
                    setPoems(response.data);
                } else {
                    setError('Invalid response format from the server');
                }
            } catch (error) {
                console.error('Error fetching poems:', error);
                setError('Failed to fetch poems');
            } finally {
                setLoading(false);
            }
        };

        fetchPoems();
    }, []);

    if (loading) {
        return <p>Loading poems...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!Array.isArray(poems) || poems.length === 0) {
        return <p>No poems available.</p>;
    }

    return (
        <div className="poetry-landing">
            <h2>Poetry Landing</h2>
            <ul className="poetry-list">
                {poems.map(poem => (
                    <li key={poem._id} className="poetry-card">
                        <Link to={`/poetry/${poem._id}`} className="poetry-card-link">
                            <h3>{poem.title}</h3>
                            <p>{poem.contentEnglish.slice(0, 100)}...</p>
                            <p className="read-more">Read More</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PoetryLanding;
