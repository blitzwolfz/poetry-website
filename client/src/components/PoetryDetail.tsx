import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
    _id: string;  // Comment ID for deleting it
    author: string;
    text: string;
    createdAt: string;
}

interface Poem {
    _id: string;
    title: string;
    contentEnglish: string;
    contentGreek: string;
    comments: Comment[];
}

const PoemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Get the poem ID from the URL
    const [poem, setPoem] = useState<Poem | null>(null);  // State to store poem data
    const [newComment, setNewComment] = useState('');  // New comment input
    const [username, setUsername] = useState('');  // User's name for comment
    const [language, setLanguage] = useState<'english' | 'greek'>('english');  // State to track selected language
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if the user is logged in and if the user is an admin
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn = !!token;
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';

    // Fetch the individual poem by ID
    useEffect(() => {
        const fetchPoem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/poetry/${id}`);
                setPoem(response.data);  // Set the fetched poem in state
            } catch (error) {
                console.error('Error fetching poem:', error);
                setError('Failed to fetch poem.');
            } finally {
                setLoading(false);
            }
        };

        fetchPoem();
    }, [id]);

    // Submit a new comment
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/poetry/${id}/comments`, {
                text: newComment,
                author: username
            });
            // Add the new comment to the list of comments
            if (poem) {
                setPoem({ ...poem, comments: [...poem.comments, response.data.comment] });
            }
            setNewComment('');  // Clear the comment input
        } catch (error) {
            console.error('Error submitting comment:', error);
            setError('Failed to submit comment.');
        }
    };

    // Handle comment deletion by admin
    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(`http://localhost:5000/poetry/${id}/comments/${commentId}`);
            // Remove the deleted comment from the state
            if (poem) {
                setPoem({ ...poem, comments: poem.comments.filter(comment => comment._id !== commentId) });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError('Failed to delete comment.');
        }
    };

    // Handle language switching
    const toggleLanguage = () => {
        setLanguage(language === 'english' ? 'greek' : 'english');
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
            {/* Language switch button */}
            <button onClick={toggleLanguage}>
                {language === 'english' ? 'Switch to Greek' : 'Switch to English'}
            </button>
            <br/ >
            <br/ >
            <h2>{poem.title}</h2>

            {/* Display the poem content based on selected language */}
            <p>{language === 'english' ? poem.contentEnglish : poem.contentGreek}</p>

            {/* Comment Section */}
            <h3>Comments</h3>
            {poem.comments.length === 0 ? (
                <p>No comments yet.</p>  // Show if there are no comments
            ) : (
                <ul>
                    {poem.comments.map((comment, index) => (
                        <li key={index}>
                            <strong>{comment.author}</strong> - {new Date(comment.createdAt).toLocaleString()}:
                            <p>{comment.text}</p>

                            {/* Show delete button if the user is an admin */}
                            {isAdmin && (
                                <button onClick={() => handleDeleteComment(comment._id)}>
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Show comment box only if the user is logged in */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmitComment}>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                    <button type="submit">Add Comment</button>
                </form>
            ) : (
                <p>You must be logged in to comment.</p>  // Message if not logged in
            )}
        </div>
    );
};

export default PoemDetail;
