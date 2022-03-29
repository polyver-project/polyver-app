import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import Layout from "../../components/layout";
import Nav from "../../components/nav";
import ArticleSection from "../../components/articleSection";
import Gpscard from "../../components/gpscard";
import Statusbar from "../../components/statusbar";
import Roundbutton from "../../components/roundbutton";
import { getAllRoverIds, getRoverData } from "../../lib/rover";
import styles from "./rover.module.scss";

export default function Rover({ postData }) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout>
        <Nav />
      </Layout>
    );
  }

  if (!postData) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Layout>
          <Nav />
          <ArticleSection title="404 - PAGE NOT FOUND" content="" />
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.left}>
          <Nav name={postData.title} />

          <iframe
            src="https://player.twitch.tv/?channel=dashducks&parent=localhost&muted=true"
            height="100%"
            width="100%"
          />
          <span className={styles.viewcount}>
            <i>
              <Image src="/icons/viewcount.svg" height={13} width={13} />
            </i>
            300
          </span>
          <div className={styles.dashboard}>
            <span className={styles.statusbar}>
              <Statusbar timer={30 * 1000} queuesize={999} />
            </span>
            <Roundbutton
              title="JOIN"
              icon="plus"
              onClick={() => alert("join button")}
            />
          </div>
        </div>

        <div className={styles.right}>
          <Gpscard />
          <iframe
            id="twitch-chat-embed"
            src="https://www.twitch.tv/embed/dashducks/chat?darkpopout&parent=localhost"
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllRoverIds();
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const postData = await getRoverData(params.id);

  return {
    props: {
      postData,
    },
  };
}
