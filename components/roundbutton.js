import styles from "./roundbutton.module.scss";
import Image from "next/image";

export default function Roundbutton(props) {
  return (
    <button className={styles.container} onClick={props.onClick}>
      <span className={styles.title}>{props.title}</span>
      <Image src={`/icons/${props.icon}.svg`} height={21} width={21} />
    </button>
  );
}
