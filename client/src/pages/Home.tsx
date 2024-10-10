import React from "react";
import "../styles/Home.scss"; // Import the SCSS for styling
import { BASE_URL } from "../constants";

const Home: React.FC = () => {
  return (
    <div>
      <div className="home fade-in">
        <h1>Paulos' Poetry</h1>
        <p>Find my work on this website</p>
      </div>

      {/* New section under Home */}
      <div className="bio-section">
        <div className="bio-text">
          <p>
            Paulos L. Ioannou is a Greek Cypriot Poet, translator, editor,
            reviewer, and publisher. He is the founder of CanCyp Publications, a
            member of the Hellenic Literary League, and a renowned poet. Fluent
            in both Greek and English.
          </p>
        </div>
        <div className="bio-image">
          <img src={BASE_URL + "/images/paul.jpg"} alt="Paulos L. Ioannou" />
        </div>
      </div>
    </div>
  );
};

export default Home;
