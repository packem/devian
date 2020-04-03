import React, { Component } from "react";
import ThemeContext from "../context/ThemeContext";

const menuLinks = [
  {
    name: "Trending",
    link: "#",
  },
  {
    name: "Featured",
    link: "#",
  },
  {
    name: "Contact",
    link: "#",
  },
];

export default class Navigation extends Component {
  static contextType = ThemeContext;

  state = {
    scrolled: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.navOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.navOnScroll);
  }

  navOnScroll = () => {
    if (window.scrollY > 20) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  };

  render() {
    const { scrolled } = this.state;
    const theme = this.context;

    return (
      <nav className={scrolled ? "nav scroll" : "nav"}>
        <div className="nav-container">
          <div className="brand">
            <a href="/">
              <img src="/github.png" className="favicon" alt="Logo" />
              <span className="text">Devian</span>
            </a>
          </div>
          <div className="links">
            {menuLinks.map((link) => (
              <a key={link.name} href={link.link}>
                {link.name}
              </a>
            ))}
            <div className="cta">
              <button
                className="dark-switcher"
                onClick={theme.toggleDark}
                aria-label="Toggle Dark Mode."
                title="Toggle Dark Mode"
              >
                {theme.dark ? (
                  <img src="/sun.svg" className="theme-icon" alt="Light Mode" />
                ) : (
                  <img src="/moon.svg" className="theme-icon" alt="Dark Mode" />
                )}
              </button>
            </div>
            {/* Sponsorship button */}
            <a
              className="kofi-button"
              target="_blank"
              rel="noopener noreferrer"
              href="#"
              aria-label="Buy me a coffee!"
              title="Buy me a coffee!"
            >
              <img src="/github.png" alt="Kofi" className="kofi" />
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
