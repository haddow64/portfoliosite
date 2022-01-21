import React from "react";

// Styles
import "./connect.css";

// Components
import { Heading } from "../Heading/Heading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const Connect = () => {
  return (
    <section name="connect" id="connect">
      <Heading text="Connect" style={{ marginBottom: "1rem" }} />
        <div className="grid-flow">
          <a href="https://github.com/haddow64" target="_blank" rel="noopener noreferrer" name="GitHub">
            <FontAwesomeIcon icon={faGithub} className="grid-item fa-5x" title="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/graeme-haddow-901107150/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="grid-item fa-5x"  title="LinkedIn"/>
          </a>
          <a href="mailto:graeme@haddow64.com" target="_blank" rel="noopener noreferrer" name="Email">
            <FontAwesomeIcon icon={faEnvelope} className="grid-item fa-5x" title="Email" />
          </a>
        </div>
    </section>
  );
};

export default Connect;