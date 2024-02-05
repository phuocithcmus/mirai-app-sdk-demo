import { WalletName } from "@pegaxy/auth-sdk";
import { Mumbai, Polygon } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import React, { useEffect } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPPORTED_WALLETS = [
  WalletName.WalletConnect,
  WalletName.EIP1193,
  WalletName.StandaloneEIP1193,
];

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

Router.events.on("beforeHistoryChange", (url) => {
  if (window) {
    (window as any).has_prev_path = !!(window as any).prev_path;
    (window as any).prev_path = window.location.pathname;
    (window as any).prev_query = window.location.search;
  }
});

const RootComponent = dynamic(() => import("../app-components/RootComponent"), {
  ssr: false,
});

// const getLibrary = (provider: any): Web3Provider => {
// 	const library = new Web3Provider(provider);

// 	library.pollingInterval = 12000;

// 	return library;
// };

const MAINNET_CHAINS = [80001, 2195, 137, 2718];

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const supportedChains =
    process.env.NEXT_PUBLIC_MODE === "prod" ||
    process.env.NEXT_PUBLIC_MODE === "test"
      ? [Polygon]
      : [Mumbai];

  const handleRouteChange = (url: string) => {
    if (window) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (router && router.asPath.includes("/contact")) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <title>Pegaxy</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <script src="/nprogress.js"></script>
				<link rel="stylesheet" href="/nprogress.css" /> */}
      </Head>

      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
				
					gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
				`}
      </Script>
      <ThirdwebProvider
        // autoSwitch
        autoConnect
        autoConnectTimeout={20000}
        activeChain={
          process.env.NEXT_PUBLIC_MODE === "prod" ||
          process.env.NEXT_PUBLIC_MODE === "test"
            ? Polygon
            : Mumbai
        }
        supportedChains={supportedChains}
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
        clientId={process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID}
      >
        <RootComponent>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
          />

          {/* <ConnectWallet
								style={{
									display: 'none',
								}}
								theme="dark"
								modalSize="compact"
								className="btn flex-grow-1"
							/> */}

          {/* <ConfigContext.Consumer>
								{(value) => {
									if (!value?.is_show_alert) {
										return null;
									}
									return (
										<ModalAccountAlerts
											show={value.is_show_alert}
											onHide={() => {
												value.showAlert(false);
											}}
										/>
									);
								}}
							</ConfigContext.Consumer> */}
        </RootComponent>
      </ThirdwebProvider>
    </>
  );
};

export default MyApp;
