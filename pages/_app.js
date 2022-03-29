import "../styles/global.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>The Polyver Project</title>
        <meta
          name="description"
          content="Explore the Calpoly campus and interact with students with The Polyver Project"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
