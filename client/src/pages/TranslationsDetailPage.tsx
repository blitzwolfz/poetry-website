import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/TranslationsDetailPage.scss";
const URL = import.meta.env.VITE_ADDRESS;

interface Translation {
  title: string;
  contentEnglish: string;
  contentGreek: string; // Add this here
}

const TranslationsDetailPage: React.FC = () => {
  const { id } = useParams();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [language, setLanguage] = useState<"english" | "greek">("english");

  useEffect(() => {
    const fetchTranslation = async () => {
      const response = await axios.get(`${URL}/translations/${id}`);
      setTranslation(response.data);
    };
    fetchTranslation();
  }, [id]);

  return (
    <div className="translations-detail">
      {translation ? (
        <>
          <h2>{translation.title}</h2>
          <button onClick={() => setLanguage("english")}>English</button>
          <button onClick={() => setLanguage("greek")}>Greek</button>
          <p>
            {language === "english"
              ? translation.contentEnglish
              : translation.contentGreek}
          </p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TranslationsDetailPage;
