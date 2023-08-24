/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/router";
import { ModalMobileQR } from "@/app-components/sign/ModalMobileQR/ModalMobileQR";

const SignPage = () => {
  const [qrcode, setQrCode] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log(router.asPath);
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "";

      console.log(`${origin}${router.asPath}`);
      const urlr = new URL(`${origin}${router.asPath}`);
      console.log(urlr.searchParams.get("wc_uri"));
      if (urlr && urlr.searchParams && urlr.searchParams.get("wc_uri")) {
        const qr = await QRCode.toDataURL(
          urlr?.searchParams?.get("wc_uri") as string
        );
        setTopicId(urlr.searchParams.get("topicId") as string);
        setQrCode(qr);
      }
    })();
  }, []);

  // useEffect(() => {
  //     // get the URL parameters which will include the auth token
  //     const params = window.location.search;
  //     if (window.opener) {
  //         // send them to the opening window
  //         window.opener.postMessage(params, '*');
  //         // close the popup
  //         window.close();
  //     }
  // });

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (window.opener) {
        // send them to the opening window
        window.opener.postMessage({ event: "window_closed" }, "*");
        // close the popup
        window.close();
      }
    });
  }, []);

  return <ModalMobileQR id={topicId} qr={qrcode} />;
};

export default SignPage;
