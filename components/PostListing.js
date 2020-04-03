import React, { Component } from "react";
import { dummyPostList } from "./dummyPostList";

export default class PostListing extends Component {
  render() {
    // const { simple } = this.props;
    const simple = false;
    const postList = dummyPostList;

    return (
      <section className={`posts ${simple ? "simple" : ""}`}>
        {postList.posts.map((post) => {
          const popular = post.categories.includes("Popular");
          // const date = formatDate(post.date);
          // const newest = moment(post.date) > moment().subtract(1, "months");
          const newest = false; // polyfill...

          // console.log(post);

          return (
            <a href={post.path} key={post.title}>
              <div className="each">
                {/* Mess around with thumbnail dimensions... */}
                {post.thumbnail ? (
                  <img style={{ width: 50, height: 50 }} src={post.thumbnail} />
                ) : (
                  <div />
                )}
                <div className="each-list-item">
                  <h2>{post.title}</h2>
                  {!simple && (
                    <div className="excerpt">{post.date.toDateString()}</div>
                  )}
                </div>
                {newest && (
                  <div className="alert">
                    <div className="new">New!</div>
                  </div>
                )}
                {popular && !simple && !newest && (
                  <div className="alert">
                    <div className="popular">Popular</div>
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </section>
    );
  }
}
