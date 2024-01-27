import "@/styles/globals.css";
import { Mumbai } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThirdwebProvider
        // autoSwitch
        autoConnect
        autoConnectTimeout={20000}
        activeChain={Mumbai}
        supportedChains={[Mumbai]}
        dAppMeta={{
          name: "Pegaxy: Rush Races",
          description:
            "Race, play, and dominate in Pegaxy, an electrifying play-to-earn PVP mecha horse battle game.",
          logoUrl: "https://cdn.pegaxy.io/images/pegaxy_logo.png",
          url: process.env.NEXT_PUBLIC_BASE_URL || "",
        }}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect({
            projectId: "64ba7104bc1c99300009f9fb4daea553",
            qrModal: "walletConnect", // or "walletConnect"
            qrModalOptions: {
              themeVariables: {
                "--wcm-z-index": "9999999",
              },
              explorerRecommendedWalletIds: "NONE",
            },
            recommended: true,
          }),
        ]}
        clientId="eddbcef9681fa92d58d5c20bc19f8129"
      >
        {" "}
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
      </ThirdwebProvider>
    </>
  );
}
