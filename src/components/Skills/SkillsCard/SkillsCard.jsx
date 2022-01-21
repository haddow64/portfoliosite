import React from "react";
import "./skills-card.css";

export const SkillsCard = ({ image, tags, title }) => {
  return (
    <div className="skills-card">
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <div className="tags">
        {tags?.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
};
