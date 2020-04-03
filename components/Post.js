import React, { Component } from "react";
import Layout from "./Layout";
// import UserInfo from '../components/UserInfo'
import PostTags from "./PostTags";
import UserInfo from "./UserInfo";
import dummyContent from "./dummy-content";
// import config from "../../data/SiteConfig";
// import { formatDate, editOnGithub } from "../utils/global";

export default class PostTemplate extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     error: false
  //   };
  // }

  render() {
    const thumbnail = false;
    // const { comments, error } = this.state
    // const { slug } = this.props.pageContext
    // const postNode = this.props.data.markdownRemark
    // const post = postNode.frontmatter
    // const popular = postNode.frontmatter.categories.find(category => category === 'Popular')
    // let thumbnail

    // if (!post.id) {
    //   post.id = slug
    // }

    // if (!post.category_id) {
    //   post.category_id = config.postDefaultCategoryID
    // }

    // if (post.thumbnail) {
    //   thumbnail = post.thumbnail.childImageSharp.fixed
    // }

    // const date = formatDate(post.date)
    // const githubLink = editOnGithub(post)
    // const twitterShare = `http://twitter.com/share?text=${encodeURIComponent(post.title)}&url=${
    //   config.siteUrl
    // }/${post.slug}/&via=taniarascia`

    return (
      <Layout>
        <article className="single container">
          <header
            className={`single-header ${!thumbnail ? "no-thumbnail" : ""}`}
          >
            {/* <img src="/github.png" alt="GitHub avatar" /> */}
            <div className="flex">
              <h1 className="text-center">React Fiber & Reconciliation</h1>
              <span
                className="text-center"
                style={{
                  fontFamily: "Gilroy Light",
                  fontSize: 20
                }}
              >
                Understand React component integration
              </span>
              {/* <div className="post-meta">
                <time className="date">31st Mar, 2020</time>/
                <a
                  className="twitter-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share
                </a>
                /
                <a
                  className="github-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Collaborate ✏️
                </a>
              </div>
              <PostTags tags={["React", "Internals"]} /> */}
            </div>
          </header>

          <div
            className="post"
            dangerouslySetInnerHTML={{
              __html: dummyContent()
            }}
          />
        </article>
        <div className="container no-comments">
          <h3>No comments?</h3>
          <p>
            There are intentionally no comments on this site. Enjoy! If you
            found any errors in this article, please feel free to{" "}
            <a
              className="github-link"
              href={"#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              edit on GitHub
            </a>
            .
          </p>
        </div>
        <UserInfo />
      </Layout>
    );
  }
}
