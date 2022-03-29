import Link from "next/link";
import styles from "./rovercard.module.scss";
import Statusbar from "./statusbar";
import Gpscard from "./gpscard";

export default function Rovercard(props) {
  return (
    <div className={styles.container}>
      <div className={styles.Gpscard}>
        <Gpscard />
      </div>
      <span className={styles.title}>{props.name}</span>
      <div className={styles.statusbar}>
        <Statusbar
          timer={props.timer * 1000}
          queuesize={props.queuesize}
          unavailable={props.unavailable}
        />
      </div>
    </div>
  );
}
