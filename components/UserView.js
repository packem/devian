import React, { Component } from "react";
import Layout from "./layout";
import PostListing from "./PostListing";
import { dummyPostList } from "./dummyPostList";

export default class UserView extends Component {
  state = {
    searchTerm: "",
    currentCategories: [],
    posts: dummyPostList.posts,
    filteredPosts: dummyPostList.posts,
  };

  handleChange = async (event) => {
    const { name, value } = event.target;

    await this.setState({ [name]: value });

    this.filterPosts();
  };

  filterPosts = () => {
    const { posts, searchTerm, currentCategories } = this.state;

    let filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (currentCategories.length > 0) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.categories &&
          currentCategories.every((cat) => post.categories.includes(cat))
      );
    }

    this.setState({ filteredPosts });
  };

  updateCategories = (category) => {
    const { currentCategories } = this.state;

    if (!currentCategories.includes(category)) {
      this.setState((prevState) => ({
        currentCategories: [...prevState.currentCategories, category],
      }));
    } else {
      this.setState((prevState) => ({
        currentCategories: prevState.currentCategories.filter(
          (cat) => category !== cat
        ),
      }));
    }
  };

  render() {
    const { posts, filteredPosts, searchTerm, currentCategories } = this.state;
    const filterCount = filteredPosts.length;
    const categories = posts.filter((p) => !!p.categories);
    const thumbnail = true; // User avatar should be checked if available...

    return (
      <Layout>
        <div className="container">
          {/* User Details Section */}
          <header
            className={`single-header ${!thumbnail ? "no-thumbnail" : ""}`}
          >
            <img src="/sun.svg" alt="GitHub avatar" />
            <div className="flex">
              <h1>John Doe</h1>
              <p>
                A passionate engineer working on open-source JavaScript projects. Yippee!
              </p>
              <p>
                <strong>Published:</strong> 33 articles
                <br />
                <strong>Member since:</strong> 2013
                <br />
                <strong>Networks:</strong>
                <ul>
                  <li>
                    <strong>Twitter: </strong> <a href="#">@john_doe_xyz</a>
                  </li>
                  <li>
                    <strong>GitHub: </strong> <a href="#">@john_doe_xyz</a>
                  </li>
                </ul>
              </p>
              <p>
                <button>Follow John</button>
              </p>
            </div>
          </header>

          {/* Article Listing Section */}
          <h1>Articles</h1>
          <div className="category-container">
            {categories.map((category) => {
              const active = currentCategories.includes(category.fieldValue);

              return (
                <div
                  className={`category-filter ${active ? "active" : ""}`}
                  key={category.fieldValue}
                  onClick={async () => {
                    await this.updateCategories(category.fieldValue);
                    await this.filterPosts();
                  }}
                >
                  {category.fieldValue}
                </div>
              );
            })}
          </div>
          <div className="search-container">
            <input
              className="search"
              type="text"
              name="searchTerm"
              value={searchTerm}
              placeholder="Type here to filter posts..."
              onChange={this.handleChange}
            />
            <div className="filter-count">{filterCount}</div>
          </div>
          <PostListing postEdges={filteredPosts} />
        </div>
      </Layout>
    );
  }
}
