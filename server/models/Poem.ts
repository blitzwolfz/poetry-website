import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true }, // The user who wrote the comment
    text: { type: String, required: true },   // The content of the comment
    createdAt: { type: Date, default: Date.now } // Timestamp of the comment
});

const poemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contentEnglish: { type: String, required: true },
    contentGreek: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [commentSchema]
});

const Poem = mongoose.model('Poem', poemSchema);
export default Poem;
