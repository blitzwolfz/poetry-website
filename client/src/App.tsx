import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PoetryLanding from './pages/PoetryLanding';
import LoginSignup from './pages/LoginSignup';
import AdminDashboard from './pages/AdminDashboard';
import './styles/theme.scss';
import PoemDetail from "./components/PoetryDetail.tsx";
import Navbar from './components/Navbar';
import PDFViewer from "./components/PDFViewer.tsx";

// Function to check if the user is an admin
const isAdmin = () => {
    return localStorage.getItem('isAdmin') === 'true';  // Check admin flag from localStorage
};

// Component to protect the admin route
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    return isAdmin() ? children : <Navigate to="/" />;  // Redirect if not an admin
};

const App: React.FC = () => {
    return (
        <div className="app-container">
            <div className="main-content">
                <Router>
                    <div className="app">
                        {/* Include the Navbar on all pages */}
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/poetry" element={<PoetryLanding />} />
                            <Route path="/poetry/:id" element={<PoemDetail />} />
                            <Route path="/pdf/:pdfName" element={<PDFViewer />} />
                            <Route path="/login" element={<LoginSignup />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedAdminRoute>
                                        <AdminDashboard />
                                    </ProtectedAdminRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </div>
        </div>
    );
};

export default App;
