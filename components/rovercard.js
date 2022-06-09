import Link from "next/link";
import styles from "./rovercard.module.scss";
import Statusbar from "./statusbar";
import Gpscard from "./gpscard";

export default function Rovercard(props) {
  return (
    <Link key={props.name} href={`/rover/${encodeURIComponent(props.name)}`}>
      <a style={{ pointerEvents: props.unavailable ? "none" : "auto" }}>
        <div className={styles.container}>
          <div className={styles.Gpscard}>
            {props.fencePicture ? (
              <Gpscard
                rovername={props.name}
                fence={props.fence}
                fencePicture={props.fencePicture}
                pos={props.pos}
                loading={false}
              />
            ) : (
              <Gpscard rovername={props.name} loading={true} />
            )}
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
      </a>
    </Link>
  );
}
