import { AppProps } from "next/app";
import Head from "next/head";
import Header from "@components/Header";
import "tailwindcss/tailwind.css";
import SectionContainer from "@components/SectionContainer";
import Footer from "@components/Footer";
import "../syntax-highlighting.css";

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
