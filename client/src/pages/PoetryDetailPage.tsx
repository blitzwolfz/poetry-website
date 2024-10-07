import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PoetryDetailPage.scss';

interface Poem {
    title: string;
    contentEnglish: string;
    contentGreek: string;
}

const PoetryDetailPage: React.FC = () => {
    const { id } = useParams();
    const [poem, setPoem] = useState<Poem | null>(null);
    const [language, setLanguage] = useState<'english' | 'greek'>('english');

    useEffect(() => {
        const fetchPoem = async () => {
            const response = await axios.get(`http://localhost:5000/poetry/${id}`);
            setPoem(response.data);
        };
        fetchPoem();
    }, [id]);

    return (
        <div className="poetry-detail">
            {poem ? (
                <>
                    <h2>{poem.title}</h2>
                    <button onClick={() => setLanguage('english')}>English</button>
                    <button onClick={() => setLanguage('greek')}>Greek</button>
                    <p>{language === 'english' ? poem.contentEnglish : poem.contentGreek}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PoetryDetailPage;
