import { useState, useEffect } from "react";

import styles from "./controlPad.module.scss";
import Roundbutton from "./roundbutton";
import Image from "next/image";

import Amplify from "aws-amplify";

import { PubSub, Auth } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";

Amplify.configure({
  Auth: {
    identityPoolId: "us-west-1:4ea66fc5-e2be-4fcb-b83c-73d2df9bf2dc",
    region: "us-west-1",
    userPoolId: "us-west-1_walA4qMug",
    userPoolWebClientId: "t5nsd87js4c95nrni5420clq5",
  },
});
// var awsIot = require("aws-iot-device-sdk");

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "us-west-1",
    aws_pubsub_endpoint: `wss://a1lc00egar11av-ats.iot.us-west-1.amazonaws.com/mqtt`,
  })
);

function mqttCmd(rover_id, cmd) {
  PubSub.publish(`${rover_id}/command`, { cmd: cmd });
}

export default function ControlPad(props) {
  const [clickState, setClickState] = useState("idle");

  const left_button = () => {
    console.log("go left");
    mqttCmd(props.rovername, "left");
    setClickState("a");
  };

  const right_button = () => {
    console.log("go right");
    mqttCmd(props.rovername, "right");
    setClickState("d");
  };

  const up_button = () => {
    console.log("go up");
    mqttCmd(props.rovername, "up");
    setClickState("w");
  };

  const bottom_button = () => {
    console.log("go down");
    mqttCmd(props.rovername, "down");
    setClickState("s");
  };

  const onWASDclick = (e) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (e.key) {
      case "a":
        left_button();
        break;
      case "d":
        right_button();
        break;
      case "w":
        up_button();
        break;
      case "s":
        bottom_button();
        break;
      default:
        break;
    }
  };

  const onWASDrelease = (e) => {
    console.log("releasing key");
    setClickState("idle");
  };

  useEffect(() => {
    console.log(
      `wss://${process.env.MQTT_ID}.iot.${process.env.AWS_REGOIN}.amazonaws.com/mqtt`
    );
    const sub = PubSub.subscribe("myTopic").subscribe({
      next: (data) => {
        try {
          console.log("message recieved");
          console.log(data);
        } catch (error) {
          console.log("Error, are you sending the correct data?");
        }
      },
      error: (error) => console.error(error),
      close: () => console.log("Done"),
    });

    document.addEventListener("keydown", onWASDclick);
    document.addEventListener("keyup", onWASDrelease);
    return () => {
      window.removeEventListener("keydown", onWASDclick);
      window.removeEventListener("keyup", onWASDrelease);
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wsdPad}>
        <button
          className={`${styles.left} ${
            clickState == "a" ? styles.clicked : ""
          }`}
          onClick={() => left_button()}
        >
          <span className={styles.title}>A</span>
          <Image src={`/icons/left.svg`} height={21} width={21} />
        </button>

        <div className={styles.centerButtons}>
          <button
            className={`${styles.up} ${
              clickState == "w" ? styles.clicked : ""
            }`}
            onClick={() => up_button()}
          >
            <span className={styles.title}>W</span>
            <Image src={`/icons/up.svg`} height={21} width={21} />
          </button>
          <button
            className={`${styles.down} ${
              clickState == "s" ? styles.clicked : ""
            }`}
            onClick={() => bottom_button()}
          >
            <span className={styles.title}>S</span>
            <Image src={`/icons/down.svg`} height={21} width={21} />
          </button>
        </div>

        <button
          className={`${styles.right} ${
            clickState == "d" ? styles.clicked : ""
          }`}
          onClick={() => right_button()}
        >
          <span className={styles.title}>D</span>
          <Image src={`/icons/right.svg`} height={21} width={21} />
        </button>
      </div>

      <Roundbutton
        title="Speak"
        icon="record"
        onClick={() => console.log("record")}
      />
    </div>
  );
}
