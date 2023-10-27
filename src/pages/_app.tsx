import "@/styles/globals.css";
import type { AppProps } from "next/app";
import toast, { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="container" style={{ display: "none" }}>
        <div
          className="responsive-iframe"
          id="popUpDiv"
          style={{
            display: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            paddingTop: "56.25%",
            position: "relative",
          }}
        ></div>
      </div>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
