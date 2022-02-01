import React from "react";

// Styles
import "./skills.css";

// Data
import { skills } from "data/data";

// Card
import { SkillsCard } from "components/Skills/SkillsCard/SkillsCard";
import { Heading } from "components/Heading/Heading";

const Skills = () => {
  return (
    <section
      data-aos="fade-right"
      className="skills-container"
      name="skills"
      id="skills"
    >
      <Heading text="Skills" style={{ marginBottom: "1rem" }} />
      <div className="skills-cards">
        {skills?.map(({ title, iconSrc, tags }, index) => (
          <SkillsCard key={index} image={iconSrc} title={title} tags={tags} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
