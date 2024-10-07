import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss'; // Assuming your styles are in this file

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false); // State to control navbar visibility
    const menuRef = useRef<HTMLDivElement>(null);  // Ref for the navbar menu
    const navigate = useNavigate();

    // Toggle the menu visibility
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isAdmin');
        navigate('/login'); // Redirect to login page after logout
    };

    // Check if the user is logged in by looking for the token
    const isLoggedIn = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');

    // Check if the user is an admin by looking for 'isAdmin' in localStorage/sessionStorage
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';

    // Close the menu if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the menu if clicked outside
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="navbar">
            {/* Hamburger Icon */}
            <button className="navbar-toggle" onClick={toggleMenu}>
                ☰
            </button>

            {/* Navbar Menu (Sliding from left) */}
            <div className={`navbar-menu ${isOpen ? 'open' : ''}`} ref={menuRef}>
                <ul>
                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                    <li><Link to="/poetry" onClick={toggleMenu}>Poetry</Link></li>

                    {/* Show Admin Dashboard link if the user is an admin */}
                    {isAdmin && (
                        <li><Link to="/admin" onClick={toggleMenu}>Admin Dashboard</Link></li>
                    )}

                    {/* Show Logout if user is logged in, otherwise show Login */}
                    {isLoggedIn ? (
                        <li>
                            <button onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button>
                        </li>
                    ) : (
                        <li>
                            <button onClick={() => { navigate('/login'); toggleMenu(); }}>Login</button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
