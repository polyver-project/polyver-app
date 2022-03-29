import Image from "next/image";
import Link from "next/link";
import styles from "./nav.module.scss";

export default function Nav(props) {
  return (
    <div className={styles.container}>
      <span className={styles.titleblock}>
        <Link href="/">
          <a>
            <Image
              src="/images/logo.png" // Route of the image file
              height={61}
              width={145}
              alt="Polyver"
            />
          </a>
        </Link>

        <span className={styles.name}>{props.name}</span>
      </span>

      <span className={styles.navbuttons}>
        <Link href="/">
          <a style={props.name ? {} : { display: "none" }}>OTHER ROVERS</a>
        </Link>
        <Link href="/aboutus">
          <a>ABOUT US</a>
        </Link>
      </span>
    </div>
  );
}
