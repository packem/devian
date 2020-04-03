import Head from "next/head";
import Post from "../components/Post";
import UserView from "../components/UserView";
import Layout from "../components/Layout";
import SimpleListing from "../components/SimpleListing";
import { dummyPostList } from "../components/dummyPostList";
import "../styles/main.scss";

const TrendingView = () => {
  return (
    <>
      <h2>Trending</h2>
      <h3>JavaScript Frameworks</h3>
      <SimpleListing data={dummyPostList} />
      <h3>Python &amp; Django</h3>
      <SimpleListing data={dummyPostList} />
    </>
  );
};

const FeaturedView = () => {
  return (
    <>
      <h2>Featured Articles </h2>

      <SimpleListing data={dummyPostList} />
    </>
  );
};

const Home = () => {
  return (
    <div className="container">
      <Head>
        <title>Devian</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserView />
      {/* <Post /> */}

      {/* <Layout>
        <TrendingView />
        <FeaturedView />
      </Layout> */}
    </div>
  );
};

export default Home;
