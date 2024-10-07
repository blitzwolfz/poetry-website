import User from '../models/User';  // Assuming you have a User model

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Make a user an admin
export const makeUserAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
        res.status(200).json({ message: 'User promoted to admin', user });
    } catch (error) {
        res.status(500).json({ message: 'Error promoting user to admin' });
    }
};

// Fetch all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from the database
        res.status(200).json(users);  // Send back the users as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Remove admin status from a user
export const removeUserAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(userId, { isAdmin: false }, { new: true });
        res.status(200).json({ message: 'User admin status removed', user });
    } catch (error) {
        res.status(500).json({ message: 'Error removing admin status' });
    }
};