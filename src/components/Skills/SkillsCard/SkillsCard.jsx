import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faDatabase,
  faPeopleGroup,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { faAws } from "@fortawesome/free-brands-svg-icons";
import "./skills-card.css";

const icons = {
  cloud: faAws,
  code: faCode,
  database: faDatabase,
  people: faPeopleGroup,
  server: faServer,
};

export const SkillsCard = ({ icon, tags, title }) => {
  return (
    <article className="skills-card">
      <div className="skill-card-heading">
        <FontAwesomeIcon
          icon={icons[icon] ?? faCode}
          className="skill-icon"
          aria-hidden="true"
        />
        <h3>{title}</h3>
      </div>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
};
