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

// Add a comment to a poem
export const addComment = async (req, res) => {
    const { id } = req.params;  // Poem ID
    const { text, author } = req.body;  // Comment data

    try {
        const poem = await Poem.findById(id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }

        // Create the comment object
        const comment = { author, text, createdAt: new Date() };

        // Add the comment to the poem's comments array
        poem.comments.push(comment);
        await poem.save();

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a comment by comment ID in a specific poem's comments array
export const deleteComment = async (req, res) => {
    const { id, commentId } = req.params;  // Get poem ID and comment ID

    try {
        const poem = await Poem.findById(id);

        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }

        // Find the comment by its ID and remove it from the comments array
        poem.comments = poem.comments.filter(comment => comment._id.toString() !== commentId);

        // Save the updated poem document
        await poem.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error' });
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

// Update an existing poem
export const updatePoem = async (req, res) => {
    try {
        const poem = await Poem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(poem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating poem' });
    }
};