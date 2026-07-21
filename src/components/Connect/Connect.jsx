import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Heading } from "components/Heading/Heading";
import "./connect.css";

const Connect = () => {
  return (
    <section className="section connect-section" id="connect">
      <Heading text="Connect" />
      <div className="contact-copy">
        <p>Open to senior, lead and staff engineering roles.</p>
      </div>
      <div className="grid-flow">
        <a
          href="https://github.com/haddow64"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <FontAwesomeIcon
            icon={faGithub}
            className="grid-item"
            aria-hidden="true"
          />
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ghaddow64/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            className="grid-item"
            aria-hidden="true"
          />
          <span>LinkedIn</span>
        </a>
        <a href="mailto:graeme@haddow64.com" aria-label="Email" title="Email">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="grid-item"
            aria-hidden="true"
          />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
};

export default Connect;
