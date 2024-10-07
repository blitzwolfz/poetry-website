import mongoose from 'mongoose';

const poemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contentEnglish: { type: String, required: true },
    contentGreek: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Poem = mongoose.model('Poem', poemSchema);
export default Poem;
