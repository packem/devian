import React, { Component } from "react";
// import kebabCase from 'lodash.kebabcase'
// import { Link } from 'gatsby'

export default class PostTags extends Component {
  render() {
    const { tags, size } = this.props;

    return (
      <div className="tag-container">
        {tags &&
          tags.map((tag) => (
            <a
              key={tag}
              style={{ textDecoration: "none" }}
              href={`/tags/${tag}/`}
            >
              <span className={size}>{tag}</span>
            </a>
          ))}
      </div>
    );
  }
}
