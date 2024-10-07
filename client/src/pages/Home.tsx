import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.scss';  // Import the SCSS for styling

// Function to check if the user is an admin
const isAdmin = () => {
    return localStorage.getItem('isAdmin') === 'true';  // Check admin status from localStorage
};

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Welcome to the Paulos' Poetry</h1>
            <p>Renowned poet! Also other stuff lmao. V---- To be deleted</p>
            <nav>
                <ul className="nav-links">
                    <li>
                        <Link to="/poetry">Explore Poetry</Link>
                    </li>
                    <li>
                        <Link to="/login">Login / Signup</Link>
                    </li>
                    {isAdmin() && (
                        <li>
                            <Link to="/admin">Admin</Link>  {/* Conditionally show Admin link */}
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Home;
