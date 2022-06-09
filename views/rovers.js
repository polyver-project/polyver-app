import Rovercard from "../components/rovercard";
import useSWR from "swr";
import Loading from "../components/loading";
import styles from "./rovers.module.scss";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

export default function Rovers() {
  const { data, error } = useSWR(`/api/rovers`, fetcher);

  if (error) return <div className={styles.container}>Failed to load DB</div>;

  if (!data) {
    return <Loading />;
  }

  data.Items.sort((a, b) => {
    if (!a.isactive) return 1;
    if (!b.isactive) return -1;
    return b.queuesize - a.queuesize;
  });

  return (
    <div className={styles.container}>
      {data.Items.map((item) => (
        <Rovercard
          key={item.pk}
          name={item.pk}
          timer={item.timeslot}
          queuesize={item.queuesize}
          unavailable={!item.isactive}
          fence={item.fence}
          fencePicture={item.fencePicture}
          pos={item.pos}
        />
      ))}
    </div>
  );
}
