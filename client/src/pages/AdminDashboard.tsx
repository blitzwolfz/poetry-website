import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.scss';

// Define the Poem and User interface for TypeScript
interface Poem {
    _id: string;
    title: string;
    contentEnglish: string;
    contentGreek: string;
}

interface User {
    _id: string;
    username: string;
    isAdmin: boolean;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',  // Make sure this points to the correct backend
});

const AdminDashboard: React.FC = () => {
    const [poems, setPoems] = useState<Poem[]>([]); // Initialize as an empty array for poems
    const [users, setUsers] = useState<User[]>([]); // Initialize as an empty array for users
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);  // Track the selected poem
    const [selectedUser, setSelectedUser] = useState<string | null>(null);  // Track the selected user
    const [newPoem, setNewPoem] = useState({
        title: '',
        contentEnglish: '',
        contentGreek: ''
    });
    const [editMode, setEditMode] = useState<boolean>(false);  // Track whether we are editing a poem
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Error handling

    // Fetch existing poems and users from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const poemResponse = await axiosInstance.get('/poetry');
                const userResponse = await axiosInstance.get('/users');  // Fetch users from the correct endpoint

                setPoems(poemResponse.data);
                setUsers(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch poems or users.');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchData();
    }, []);

    // Handle input change for the new poem form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewPoem({ ...newPoem, [e.target.name]: e.target.value });
    };

    // Handle form submission to add a new poem or update an existing one
    const handleSubmitPoem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedPoem) {
            // Update the poem
            try {
                const response = await axiosInstance.put(`/poetry/${selectedPoem._id}`, newPoem);  // Update poem
                setPoems(poems.map(poem => poem._id === selectedPoem._id ? response.data : poem));  // Update the poem in the state
                setNewPoem({ title: '', contentEnglish: '', contentGreek: '' });  // Clear the form
                setEditMode(false);  // Exit edit mode
                setSelectedPoem(null);  // Clear selected poem
            } catch (error) {
                console.error('Error updating poem:', error);
                setError(error + ' Failed to update poem.');
            }
        } else {
            // Create a new poem
            try {
                const response = await axiosInstance.post('/poetry', newPoem);
                setPoems([...poems, response.data]); // Add the new poem to the list
                setNewPoem({ title: '', contentEnglish: '', contentGreek: '' }); // Clear the form
            } catch (error) {
                console.error('Error adding poem:', error);
                setError(error + ' Failed to add poem.');
            }
        }
    };

    // Handle poem deletion
    const handleDeletePoem = async () => {
        if (selectedPoem) {
            try {
                await axiosInstance.delete(`/poetry/${selectedPoem._id}`);
                setPoems(poems.filter(poem => poem._id !== selectedPoem._id)); // Remove the deleted poem from the list
                setSelectedPoem(null);  // Clear the selected poem
            } catch (error) {
                console.error('Error deleting poem:', error);
                setError(error + ' Failed to delete poem.');
            }
        }
    };

    // Handle selecting a poem for editing
    const handleEditPoem = (poemId: string) => {
        const poem = poems.find(p => p._id === poemId);
        if (poem) {
            setNewPoem({ title: poem.title, contentEnglish: poem.contentEnglish, contentGreek: poem.contentGreek });
            setSelectedPoem(poem);
            setEditMode(true);  // Enter edit mode
        }
    };

    // Handle user deletion
    const handleDeleteUser = async () => {
        if (selectedUser) {
            try {
                await axiosInstance.delete(`/user/${selectedUser}`);
                setUsers(users.filter(user => user._id !== selectedUser)); // Remove the deleted user from the list
                setSelectedUser(null);  // Clear the selected user
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error + ' Failed to delete user.');
            }
        }
    };

    // Handle promoting a user to admin
    const handlePromoteUser = async () => {
        if (selectedUser) {
            try {
                await axiosInstance.put(`/user/${selectedUser}/make-admin`);
                setUsers(users.map(user => (user._id === selectedUser ? { ...user, isAdmin: true } : user))); // Update user to admin
                setSelectedUser(null);  // Clear the selected user
            } catch (error) {
                console.error('Error promoting user to admin:', error);
                setError(error + ' Failed to promote user.');
            }
        }
    };

    // Handle removing admin status from a user
    const handleRemoveAdmin = async () => {
        if (selectedUser) {
            try {
                await axiosInstance.put(`/user/${selectedUser}/remove-admin`);
                setUsers(users.map(user => (user._id === selectedUser ? { ...user, isAdmin: false } : user))); // Update user admin status
                setSelectedUser(null);  // Clear the selected user
            } catch (error) {
                console.error('Error removing admin status:', error);
                setError(error + ' Failed to remove admin status.');
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {/* Display loading or error */}
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Add or edit poem form */}
            <div className="post-editor">
                <h3>{editMode ? 'Edit Poem' : 'Add New Poem'}</h3>
                <form onSubmit={handleSubmitPoem}>
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
                    <button type="submit">{editMode ? 'Update Poem' : 'Add Poem'}</button>
                </form>
            </div>

            {/* Poem Management */}
            <div className="poem-management">
                <h3>Manage Poems</h3>
                <select value={selectedPoem?._id || ''} onChange={(e) => handleEditPoem(e.target.value)}>
                    <option value="">Select a poem</option>
                    {poems.map(poem => (
                        <option key={poem._id} value={poem._id}>
                            {poem.title}
                        </option>
                    ))}
                </select>

                {selectedPoem && (
                    <div className="poem-actions">
                        <button onClick={handleDeletePoem}>Delete Poem</button>
                    </div>
                )}
            </div>

            {/* User Management */}
            <div className="user-management">
                <h3>Manage Users</h3>
                <select value={selectedUser || ''} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.username} {user.isAdmin ? '(Admin)' : ''}
                        </option>
                    ))}
                </select>

                {selectedUser && (
                    <div className="user-actions">
                        <button onClick={handleDeleteUser}>Delete User</button>
                        {!users.find(user => user._id === selectedUser)?.isAdmin ? (
                            <button onClick={handlePromoteUser}>Make Admin</button>
                        ) : (
                            <button onClick={handleRemoveAdmin}>Remove Admin</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
