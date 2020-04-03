// TODO: Sort this part out. Pagination needed for articles exceeding
// a specific threshold.
const dummyPostList = {
  posts: [
    {
      path: "#",
      tags: ["React"],
      thumbnail: "/github.png",
      date: new Date(),
      excerpt: "Hi there, I'm an excerpt",
      timeToRead: "7 mins",
      title: "Getting Started with React",
      categories: ["React", "Popular"],
    },
    {
      path: "#",
      tags: ["React"],
      thumbnail: "/github.png",
      date: new Date(),
      excerpt: "Hi there, I'm an excerpt",
      timeToRead: "7 mins",
      title: "Getting Started with Vue",
      categories: ["Vue", "New"],
    },
    {
      path: "#",
      tags: ["React"],
      thumbnail: "/github.png",
      date: new Date(),
      excerpt: "Hi there, I'm an excerpt",
      timeToRead: "7 mins",
      title: "Getting Started with Angular",
      categories: ["Angular"],
    },
  ],
};

export { dummyPostList };
