// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "../styles/TranslationsLanding.scss"; // Assuming a separate stylesheet
// import { BASE_URL } from "../constants";
// const URL = import.meta.env.VITE_ADDRESS;

// interface Translation {
//   _id: string;
//   title: string;
//   contentEnglish: string;
//   contentGreek: string;
// }

// const TranslationsLanding: React.FC = () => {
//   const [translations, setTranslations] = useState<Translation[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTranslations = async () => {
//       try {
//         const response = await axios.get(`${URL}/translations`);
//         setTranslations(response.data);
//       } catch (error) {
//         console.error("Error fetching translations:", error);
//         setError("Failed to fetch translations.");
//       }
//     };
//     fetchTranslations();
//   }, []);

//   return (
//     <div className="translations-landing">
//       <h2>Translations Landing</h2>
//       {error && <p className="error-message">{error}</p>}
//       <ul className="translations-list">
//         {translations.map((translation) => (
//           <li key={translation._id} className="translation-card">
//             <Link
//               to={`${BASE_URL}/translations/${translation._id}`}
//               className="translation-card-link"
//             >
//               <h1 className="translation-title">{translation.title}</h1>
//               <div
//                 className="translation-snippet"
//                 dangerouslySetInnerHTML={{
//                   __html: translation.contentEnglish.slice(0, 200),
//                 }}
//               />
//               <p className="read-more">Read More</p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TranslationsLanding;

import React from "react";
import "../styles/TranslationsLanding.scss"; // Assuming a separate stylesheet

const TranslationsLanding: React.FC = () => {
  return (
    <div className="translations-landing">
      <h2>Translations Landing</h2>
      <p className="coming-soon">Coming Soon...</p>{" "}
    </div>
  );
};

export default TranslationsLanding;
