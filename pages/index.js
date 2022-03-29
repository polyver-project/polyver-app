// import Link from "next/link";
import Layout from "../components/layout";
import Nav from "../components/nav";
import Rovers from "../views/rovers";

export default function Home() {
  return (
    <Layout>
      <Nav />
      <Rovers />
    </Layout>
  );
}
