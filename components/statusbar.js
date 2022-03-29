import styles from "./statusbar.module.scss";
import Countdown from "react-countdown";
import Image from "next/image";

// Random component
const Completionist = () => <span>0:00</span>;

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  const secs = seconds.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <b>
        {minutes}:{secs}
      </b>
    );
  }
};

export default function Statusbar(props) {
  if (props.unavailable) {
    return (
      <div className={styles.container}>
        <span>CURRENTLY UNAVAILABLE</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <Image src="/icons/clock.svg" height={55} width={55} />

        <div>
          <span>TIME SLOT</span>
          <Countdown
            autoStart={false}
            date={Date.now() + props.timer}
            intervalDelay={0}
            precision={1}
            renderer={renderer}
          />
        </div>
      </div>

      <div className={styles.item}>
        <Image src="/icons/queue.svg" height={55} width={55} />
        <div>
          <span>QUEUE SIZE</span>
          <b>{props.queuesize}</b>
        </div>
      </div>
    </div>
  );
}
