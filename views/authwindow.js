import styles from "./authwindow.module.scss";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Authwindow(props) {
  return (
    <div
      className={styles.container}
      onClick={() => props.setAuthVisible(false)}
    >
      <div className={styles.subcontainer} onClick={(e) => e.stopPropagation()}>
        <Image
          src="/images/logo.png" // Route of the image file
          height={61}
          width={145}
          alt="Polyver"
        />
        <span className={styles.title}>Sign In / Sign Up</span>
        <span className={styles.message}>JOIN THE PROJECT</span>
        <button onClick={() => signIn("cognito")}>Sign In</button>
      </div>
    </div>
  );
}
