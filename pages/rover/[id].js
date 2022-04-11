import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";

import Layout from "../../components/layout";
import Nav from "../../components/nav";
import ArticleSection from "../../components/articleSection";
import Gpscard from "../../components/gpscard";
import Statusbar from "../../components/statusbar";
import Roundbutton from "../../components/roundbutton";
import { getAllRoverIds, getRoverData } from "../../lib/rover";
import Loading from "../../components/loading";
import styles from "./rover.module.scss";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

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

  if (!postData.isactive) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Layout>
          <Nav name={postData.title} />
          <ArticleSection
            title="This rover is currently unavailable"
            content=""
          />
        </Layout>
      </>
    );
  }

  const { data, error } = useSWR(
    `/api/rovers/${encodeURIComponent(postData.title)}`,
    fetcher
  );

  if (error) return <div className={styles.container}>Failed to load DB</div>;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.left}>
          <Nav name={postData.title} />

          <iframe
            src={`https://player.twitch.tv/?channel=${postData.streamurl}&parent=localhost&muted=true`}
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
              {data ? (
                <Statusbar
                  timer={data.Item.timeslot * 1000}
                  queuesize={data.Item.queuesize}
                />
              ) : (
                <Statusbar timer={0} queuesize={0} />
              )}
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
            src={`https://www.twitch.tv/embed/${postData.streamurl}/chat?darkpopout&parent=localhost`}
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </div>

      {!data && <Loading />}
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
