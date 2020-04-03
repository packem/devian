import React, { Component } from "react";
import ThemeContext from "../context/ThemeContext";
import Navigation from "./Navigation";
import Footer from "./Footer";

const menuLinks = [
  {
    name: "Trending",
    link: "#",
  },
  {
    name: "Featured",
    link: "#",
  },
  // {
  //   name: "Contact",
  //   link: "#",
  // },
];

export default class Layout extends Component {
  static contextType = ThemeContext;

  render() {
    const { dark, notFound } = this.context;
    const { children } = this.props;
    let themeClass = "";

    if (dark && !notFound) {
      themeClass = "dark";
    } else if (notFound) {
      themeClass = "not-found";
    }

    return (
      <>
        <Navigation menuLinks={menuLinks} />
        <main id="main-content">{children}</main>
        <Footer />
      </>
    );
  }
}
