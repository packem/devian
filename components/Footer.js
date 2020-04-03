import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <div>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Link 1
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Link 2
          </a>
          <a href="#">Link 3</a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Link 4
          </a>
        </div>
        <div>
          {/* These are actual anchor tags. Just modify 'em... */}
          <a href="#" title="Open-source on GitHub">
            <img
              src="/github.png"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
          {/* <a href="https://www.netlify.com/" title="Hosted by Netlify">
            <img
              src={netlify}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a> */}
          <a href="#" title="Built with Gatsby">
            <img
              src="/github.png"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
        </div>
      </footer>
    );
  }
}
