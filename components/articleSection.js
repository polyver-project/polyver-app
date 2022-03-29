import styles from "./articlesection.module.scss";

export default function ArticleSection(props) {
  return (
    <article className={styles.container}>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
    </article>
  );
}
