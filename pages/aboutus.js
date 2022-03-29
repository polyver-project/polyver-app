import Head from "next/head";

import Nav from "../components/nav";
import Layout from "../components/layout";
import ArticleSection from "../components/articleSection";

export default function Aboutus() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta
          name="description"
          content="learn more about The Polyver Project"
        />
      </Head>
      <Layout>
        <Nav />
        <ArticleSection
          title="ABOUT US"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum sed tellus vitae tempor. Etiam quis cursus est, sit amet placerat augue. Donec nulla nibh, commodo et odio eu, tincidunt efficitur justo. Sed ex arcu, sodales sit amet commodo efficitur, fringilla ac ante. Etiam lacinia risus et eros vestibulum, posuere placerat tellus condimentum. Proin at luctus diam. Sed sed sagittis lacus. Vivamus sit amet orci nisl. Nam non placerat purus."
        />
      </Layout>
    </>
  );
}
