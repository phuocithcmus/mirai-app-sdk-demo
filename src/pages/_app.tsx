import "@/styles/globals.css";
import type { AppProps } from "next/app";
import toast, { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div
        id="popUpDiv"
        style={{ display: "none", width: "100%", height: "100%" }}
      ></div>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
