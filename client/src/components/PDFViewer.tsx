import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PDFViewer.scss'; // Optional, if you have custom styles

const PDFViewer: React.FC = () => {
    const { pdfName } = useParams<{ pdfName: string }>(); // Get the PDF name from the route

    return (
        <div className="pdf-viewer">
            <h2>{pdfName}</h2>
            <iframe
                src={`/pdfs/${pdfName}.pdf`}
                width="100%"
                height="100%"
                style={{
                    border: 'none',
                    minHeight: '90vh',  // Ensure the iframe takes up most of the viewport height
                }}
                title={pdfName}
            />
        </div>
    );
};

export default PDFViewer;
