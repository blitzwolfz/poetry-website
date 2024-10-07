import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PoetryCard.scss';  // SCSS for PoetryCard

interface PoetryCardProps {
    _id: string;
    title: string;
    contentEnglish: string;
}

const PoetryCard: React.FC<PoetryCardProps> = ({ _id, title, contentEnglish }) => {
    return (
        <div className="poetry-card">
            <h3>{title}</h3>
            <p>{contentEnglish.slice(0, 100)}...</p>  {/* Show first 100 characters of the poem */}
            <Link to={`/poetry/${_id}`} className="read-more">Read More</Link>
        </div>
    );
};

export default PoetryCard;
