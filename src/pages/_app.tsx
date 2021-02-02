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
        <title>Jamie Brynes</title>
      </Head>
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
    </>
  );
};

export default App;
