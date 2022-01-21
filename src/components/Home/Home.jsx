import React from "react";

// PNG
import man from "images/me.png";

// Animation
import { Link } from "react-scroll";
import { motion } from "framer-motion";

// CSS
import "./home.css";

const contentVariants = {
  initial: {
    translateX: "-100vw",
    opacity: 0,
  },

  animate: {
    translateX: "0vw",
    opacity: 1,
    transition: {
      duration: 2,
      when: "beforeChildren",
    },
  },
};


const Home = () => {
  return (
    <section className="home-container" id="home" name="home">
      <motion.div
        className="content"
        variants={contentVariants}
        initial="initial"
        animate="animate"
      >
        <p>Hi, I'm Graeme. A Full stack developer.</p>
        <Link
          className="home-btn"
          to={"skills"}
          hashSpy={true}
          spy={true}
          smooth={true}
          delay={100}
          offset={-100}
          duration={500}
        >
          See my Skills
        </Link>
        <a 
         href="https://github.com/haddow64/CV/raw/main/Graeme_Haddow_-_Senior_Software_Engineer.pdf"
         target="_blank" rel="noopener noreferrer"
         className="home-btn">
           Get my CV
        </a>
      </motion.div>

      <motion.div
        className="png"
        animate={{ translateY: [-10, 0, -10, 0] }}
        transition={{ yoyo: Infinity, duration: 12 }}
      >
        <img src={man} alt="Developer" />
      </motion.div>
    </section>
  );
};

export default Home;