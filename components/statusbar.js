import { useRef, useEffect, memo } from "react";
import styles from "./statusbar.module.scss";
import Countdown from "react-countdown";
import Image from "next/image";

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  const secs = seconds.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  if (completed) {
    // Render a completed state
    return <b>0:00</b>;
  } else {
    // Render a countdown
    return (
      <b>
        {minutes}:{secs}
      </b>
    );
  }
};

export default memo((props) => {
  const countdownRef = useRef();

  const startCountdown = () => countdownRef.current.start();

  useEffect(() => {
    if (props.userstate == "controller") startCountdown();
  }, [props.userstate]);

  if (props.unavailable) {
    return (
      <div className={styles.container}>
        <span>CURRENTLY UNAVAILABLE</span>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      style={props.position > 0 ? { width: 525 } : {}}
    >
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
            onComplete={props.onComplete}
            ref={countdownRef}
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

      {props.position > 0 && (
        <div className={styles.item}>
          <Image src="/icons/position.svg" height={55} width={55} />
          <div>
            <span>POSITION</span>
            <b>{props.position}</b>
          </div>
        </div>
      )}
    </div>
  );
});
