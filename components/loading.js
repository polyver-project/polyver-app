import styles from "./loading.module.scss";
import { Grid } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Grid color="white" ariaLabel="loading-indicator" />;
    </div>
  );
}
