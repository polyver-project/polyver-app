import { useState, useEffect, useRef } from "react";
import styles from "./gpscard.module.scss";
import Image from "next/image";

function useContainerDimensions(myRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: (myRef && myRef.current.offsetWidth) || 0,
      height: (myRef && myRef.current.offsetHeight) || 0,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
}

export default function Gpscard(props) {
  const componentRef = useRef();
  const [cx, setcx] = useState(0);
  const [cy, setcy] = useState(0);
  const { width, height } = useContainerDimensions(componentRef);

  const fence_image = `/images/${props.rovername}_fence.png`;

  useEffect(() => {
    if (props.loading) return;
    // console.log("width: ", width, "\theihgt: ", height);
    // console.log(props.pos);
    // console.log(props.fencePicture);

    const left_x = props.fencePicture[0][0];
    const bottom_y = props.fencePicture[0][1];
    const picWidth = props.fencePicture[1][0] - left_x; //width of picture in degrees
    const picHeight = props.fencePicture[3][1] - bottom_y; //height of picture in degrees

    const rover_relativePosX = props.pos[0] - left_x;
    const rover_relativePosY = props.pos[1] - bottom_y;

    const rover_cx = width * (rover_relativePosX / picWidth);
    const rover_cy = height - height * (rover_relativePosY / picHeight);

    // console.log("picWidth: ", picWidth, "picHeight: ", picHeight);
    // console.log(
    //   "rover_PosX: ",
    //   rover_relativePosX,
    //   "rover_PosY: ",
    //   rover_relativePosY
    // );
    // console.log("rover_cx: ", rover_cx, "rover_cy: ", rover_cy);
    setcx(rover_cx);
    setcy(rover_cy);
  }, [width, height, props.pos]);

  return (
    <div ref={componentRef} className={styles.container}>
      <Image
        styles={{ flex: 1, width: "100%" }}
        src={fence_image}
        alt="gps_map"
        layout="fill"
      />
      <svg width="100%" height="100%">
        <circle r="4" cx={cx} cy={cy} className="cursor" />
      </svg>
    </div>
  );
}
