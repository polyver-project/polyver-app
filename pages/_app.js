import "../styles/global.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>The Polyver Project</title>
        <meta
          name="description"
          content="Explore the Calpoly campus and interact with students with The Polyver Project"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core-min.js"
          type="text/javascript"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac-min.js"
          type="text/javascript"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256-min.js"
          type="text/javascript"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js"
          type="text/javascript"
        ></script>
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
