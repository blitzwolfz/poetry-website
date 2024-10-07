import Poem from '../models/Poem';

// Fetch all poems
export const getPoems = async (req, res) => {
    try {
        const poems = await Poem.find();  // Fetch all poems from the database
        res.json(poems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching poems' });
    }
};

// Fetch a single poem by ID
export const getPoemById = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);  // Find poem by ID
        if (!poem) {
            return res.status(404).json({ error: 'Poem not found' });
        }
        res.json(poem);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching poem' });
    }
};

// Create a new poem
export const createPoem = async (req, res) => {
    try {
        const poem = new Poem(req.body);  // Create a new poem
        await poem.save();  // Save the poem in the database
        res.status(201).json(poem);  // Return the newly created poem
    } catch (error) {
        res.status(500).json({ error: 'Error creating poem' });
    }
};

// Delete a poem by ID
export const deletePoem = async (req, res) => {
    try {
        const { id } = req.params;  // Get the ID from the request parameters

        console.log(`Attempting to delete poem with ID: ${id}`);  // Log the poem ID for debugging

        const poem = await Poem.findByIdAndDelete(id);  // Find and delete the poem by ID

        if (!poem) {
            console.log(`Poem with ID ${id} not found`);  // Log if the poem was not found
            return res.status(404).json({ error: 'Poem not found' });
        }

        console.log(`Poem with ID ${id} deleted successfully`);  // Log success
        res.status(204).end();  // Respond with no content on successful deletion
    } catch (error) {
        console.error('Error deleting poem:', error);  // Log the error
        res.status(500).json({ error: 'Error deleting poem' });
    }
};
