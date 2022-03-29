import Rovercard from "../components/rovercard";
import Link from "next/link";
import styles from "./rovers.module.scss";

export default function Rovers() {
  return (
    <div className={styles.container}>
      <Link href="/rover/1">
        <a>
          <Rovercard name="THIS ROVER NAME" timer={300} queuesize={12} />
        </a>
      </Link>

      <Link href="/rover/2">
        <a>
          <Rovercard name="THIS ROVER NAME2" timer={60} queuesize={50} />
        </a>
      </Link>

      <Link href="/rover/3">
        <a>
          <Rovercard name="THIS ROVER NAME3" timer={30} queuesize={999} />
        </a>
      </Link>

      <a>
        <Rovercard name="THIS ROVER NAME4" unavailable={true} />
      </a>
    </div>
  );
}
