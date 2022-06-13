import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR, { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";

import Layout from "../../components/layout";
import Nav from "../../components/nav";
import ArticleSection from "../../components/articleSection";
import Gpscard from "../../components/gpscard";
import Statusbar from "../../components/statusbar";
import Roundbutton from "../../components/roundbutton";
import ControlPad from "../../components/controlPad";
import { getAllRoverIds, getRoverData } from "../../lib/rover";
import Loading from "../../components/loading";
import Authwindow from "../../views/authwindow";
import styles from "./rover.module.scss";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

export default function Rover({ postData }) {
  const [authVisible, setAuthVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userstate, setUserstate] = useState("join");
  const [userpos, setUserpos] = useState(-1);
  const [timestamp, setTimestamp] = useState(-1);
  const [refreshCounter, setrefreshCounter] = useState(0);

  const onStorageUpdate = (e) => {
    const { key, newValue } = e;

    switch (key) {
      case "userstate":
        setUserstate(newValue);
        break;
      case "userpos":
        setUserpos(newValue);
        break;
      case "timestamp":
        setTimestamp(newValue);
        break;
      default:
        break;
    }
  };

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

  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    `/api/rovers/${encodeURIComponent(postData.title)}`,
    fetcher
  );
  const { data: session, status } = useSession({ required: true });

  if (error) return <div className={styles.container}>Failed to load DB</div>;

  const onSetController = (data) => {
    console.log(data);
    setUserstate("controller");

    window.onbeforeunload = function (e) {
      const dialogText =
        "You will lose your controller position. Are you sure you want to leave?";
      e.returnValue = dialogText;
      return dialogText;
    };
  };

  const onQueueComplete = (data) => {
    setUserstate("inqueue");
    setTimestamp(data.timestamp);
    localStorage.setItem("userstate", "inqueue");
    localStorage.setItem("timestamp", data.timestamp);
  };

  const onDequeueComplete = () => {
    data.Item.queuesize -= 1;
    setUserstate("join");
    setUserpos(-1);
    setTimestamp(-1);
    localStorage.setItem("userstate", "join");
    localStorage.setItem("userpos", -1);
    localStorage.setItem("timestamp", -1);

    //request update to data populating the page
    mutate(`/api/rovers/${encodeURIComponent(postData.title)}`);
  };

  const onTimerComplete = useCallback(() => {
    console.log("timer finished");
    fetch(`/api/rovers/${encodeURIComponent(postData.title)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setLoading(false);
        setUserstate("join");
        setUserpos(-1);
        setTimestamp(-1);
        localStorage.setItem("userstate", "join");
        localStorage.setItem("userpos", -1);
        localStorage.setItem("timestamp", -1);
      });
  }, []);

  useEffect(() => {
    //check to see if state can be retrieved from local storage
    const currUserState = localStorage.getItem("userstate") || "join";
    setUserstate(currUserState);
    setUserpos(localStorage.getItem("userpos") || -1);
    setTimestamp(localStorage.getItem("timestamp") || -1);
    window.addEventListener("storage", onStorageUpdate);

    console.log("---------");
    console.log(currUserState);
    console.log(status);
    if (status === "loading")
      return () => {
        window.removeEventListener("storage", onStorageUpdate);
      };

    if (!session) {
      console.log("no session");
      console.log(session.user.email);
      onDequeueComplete();
    } else if (currUserState == "inqueue") {
      fetch(
        `/api/rovers/${encodeURIComponent(postData.title)}/${encodeURIComponent(
          session.user.email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.Count > 0) {
            console.log("updating...");
            setUserpos(data.Items[0].qpos);
            localStorage.setItem("userpos", data.Items[0].qpos);
          } else {
            onDequeueComplete();
          }
        });
    }

    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, [status]);

  useEffect(() => {
    //Interval timer to update data on the page
    const interval = setInterval(() => {
      mutate(`/api/rovers/${encodeURIComponent(postData.title)}`);
      setrefreshCounter(Math.random() * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("updating page data");
    console.log(data);

    if (data && !data.controlled && userstate == "inqueue" && userpos == 1) {
      //dequeing switching to controller state
      console.log("dequeing switching to controller state");

      setLoading(true);
      fetch(`/api/rovers/${encodeURIComponent(postData.title)}`, {
        method: "DELETE",
        body: JSON.stringify({ timestamp }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          //dequeue complete, now join again
          fetch(`/api/rovers/${encodeURIComponent(postData.title)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setLoading(false);
              if (data.controlled) {
                onSetController(data);
              }
            });
        });
    }
  }, [refreshCounter]);

  useEffect(() => {
    if (data && status === "authenticated" && userstate === "inqueue") {
      mutate(`/api/rovers/${encodeURIComponent(postData.title)}`);
      data.Item.queuesize += 1;
      setUserpos(data.Item.queuesize);
      localStorage.setItem("userpos", data.Item.queuesize);

      const interval = setInterval(() => {
        console.log("updating queue data");
        fetch(
          `/api/rovers/${encodeURIComponent(
            postData.title
          )}/${encodeURIComponent(session.user.email)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("in interval timer for inqueue");
            console.log(data);
            console.log(userstate);
            if (!data) {
              return () => clearInterval(interval);
            }
            setUserpos(data.Items[0].qpos);
            localStorage.setItem("userpos", data.Items[0].qpos);
          });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [status, userstate]);

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
          {/* <span className={styles.viewcount}>
            <i>
              <Image src="/icons/viewcount.svg" height={13} width={13} />
            </i>
            300
          </span> */}
          <div className={styles.dashboard}>
            <span className={styles.statusbar}>
              {data ? (
                <Statusbar
                  timer={data.Item.timeslot * 1000}
                  queuesize={data.Item.queuesize}
                  position={userpos}
                  onComplete={onTimerComplete}
                  userstate={userstate}
                />
              ) : (
                <Statusbar timer={0} queuesize={0} />
              )}
            </span>
            {data && userstate == "join" && (
              <Roundbutton
                title="JOIN"
                icon="plus"
                onClick={() => {
                  if (session) {
                    setLoading(true);
                    fetch(`/api/rovers/${encodeURIComponent(postData.title)}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        setLoading(false);
                        if (data.controller) {
                          onSetController(data);
                        } else {
                          onQueueComplete(data);
                        }
                      });
                  } else {
                    setAuthVisible(true);
                  }
                }}
              />
            )}

            {userpos > 0 && (
              <Roundbutton
                title="CANCEL"
                icon="cancel"
                onClick={() => {
                  setLoading(true);
                  fetch(`/api/rovers/${encodeURIComponent(postData.title)}`, {
                    method: "DELETE",
                    body: JSON.stringify({ timestamp }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => response.json())
                    .then(() => {
                      setLoading(false);
                      onDequeueComplete();
                    });
                }}
              />
            )}

            {userstate === "controller" && (
              <ControlPad rovername={data.Item.pk} />
            )}
          </div>
        </div>

        <div className={styles.right}>
          {data ? (
            <Gpscard
              rovername={data.Item.pk}
              fence={data.Item.fence}
              fencePicture={data.Item.fencePicture}
              pos={data.Item.pos}
              loading={false}
            />
          ) : (
            <Gpscard rovername={postData.title} loading={true} />
          )}
          <iframe
            id="twitch-chat-embed"
            src={`https://www.twitch.tv/embed/${postData.streamurl}/chat?darkpopout&parent=localhost`}
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </div>

      {(!data || loading) && <Loading />}
      {authVisible && !session && (
        <Authwindow setAuthVisible={setAuthVisible} />
      )}
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
