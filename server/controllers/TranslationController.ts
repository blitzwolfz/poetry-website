// TranslationController.ts
import { Request, Response } from 'express';
import Translation from '../models/Translations';

// Upload PDF
export const uploadPDF = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const pdfFile = req.file;

        if (!pdfFile) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const translation = new Translation({
            title,
            pdf: pdfFile.buffer,
            contentType: pdfFile.mimetype,
        });

        await translation.save();
        res.status(201).json({ message: 'PDF uploaded successfully', translationId: translation._id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload PDF', error });
    }
};

// Get all translations
export const getAllTranslations = async (req: Request, res: Response) => {
    try {
        const translations = await Translation.find({}, 'title createdAt');
        res.status(200).json(translations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve translations', error });
    }
};

// Delete a translation by ID
export const deleteTranslation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Translation.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Translation not found' });
        }

        res.status(200).json({ message: 'Translation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete translation', error });
    }
};

// Stream PDF
export const streamPDF = async (req: Request, res: Response) => {
    try {
        const translation = await Translation.findById(req.params.id);

        if (!translation) {
            return res.status(404).json({ message: 'Translation not found' });
        }

        res.contentType(translation.contentType);
        res.send(translation.pdf);
    } catch (error) {
        res.status(500).json({ message: 'Failed to stream PDF', error });
    }
};
