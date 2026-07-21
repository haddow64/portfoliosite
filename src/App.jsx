import { useEffect, useState } from "react";

import Nav from "components/Nav/Nav";
import Home from "components/Home/Home";
import About from "components/About/About";
import Skills from "components/Skills/Skills";
import Impact from "components/Impact/Impact";
import Experience from "components/Experience/Experience";
import Education from "components/Education/Education";
import Connect from "components/Connect/Connect";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-container">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" tabIndex="-1">
        <Home />
        <About />
        <Skills />
        <Impact />
        <Experience />
        <Education />
        <Connect />
      </main>
    </div>
  );
}

export default App;
