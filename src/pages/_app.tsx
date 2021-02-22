import { AppProps } from "next/app";
import Head from "next/head";
import Header from "@components/Header";
import SectionContainer from "@components/SectionContainer";
import Footer from "@components/Footer";

import { config } from "@fortawesome/fontawesome-svg-core";
import "tailwindcss/tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../syntax-highlighting.css";

// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-128.png" sizes="128x128" />
        <link rel="icon" href="/favicon-192.png" sizes="192x192" />

        <link rel="shortcut icon" sizes="196x196" href="/favicon-196.png" />

        <link
          rel="apple-touch-icon"
          href="path/to/favicon-152.png"
          sizes="152x152"
        />
        <link
          rel="apple-touch-icon"
          href="path/to/favicon-180.png"
          sizes="180x180"
        />

        <title>Jamie Brynes</title>
      </Head>
      <div className="dark:bg-gray-900">
        <div className="min-h-screen">
          <SectionContainer>
            <Header />
          </SectionContainer>
          <SectionContainer>
            <Component {...pageProps} />
          </SectionContainer>
        </div>
        <SectionContainer>
          <Footer />
        </SectionContainer>
      </div>
    </>
  );
};

export default App;
