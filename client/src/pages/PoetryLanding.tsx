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
    const [error, setError] = useState<string | null>(null);
    const pdfFiles = ['SamplePoem'];

    // Fetch poems from the API
    useEffect(() => {
        const fetchPoems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/poetry');
                setPoems(response.data);
            } catch (error) {
                console.error('Error fetching poems:', error);
                setError('Failed to fetch poems.');
            }
        };
        fetchPoems();
    }, []);

    return (
        <div className="poetry-landing">
            <h2>Poetry Landing</h2>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {pdfFiles.map((pdfName, index) => (
                    <li key={index}>
                        <Link to={`/pdf/${pdfName}`}>
                            {pdfName} (View PDF)
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="poetry-list">
                {poems.map(poem => (
                    <li key={poem._id} className="poetry-card">
                        <Link to={`/poetry/${poem._id}`} className="poetry-card-link">
                            <h1 className="poem-title">{poem.title}</h1>
                            {/* Render a snippet of the content with HTML formatting */}
                            <div className="poem-snippet"
                                 dangerouslySetInnerHTML={{__html: poem.contentEnglish.slice(0, 200)}}/>
                            <p className="read-more">Read More</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PoetryLanding;
