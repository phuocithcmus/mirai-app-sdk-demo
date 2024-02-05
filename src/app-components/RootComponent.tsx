import { EventId, ScreenViewSchema } from "@pegaxy/event-tracking-webworker";
import moment from "moment";
import { useRouter } from "next/router";
import querystring from "querystring";
import React, { useEffect } from "react";
import { getInjectedMetamaskProvider } from "@thirdweb-dev/wallets";
import {
  metamaskWallet,
  useConnect,
  useConnectedWallet,
} from "@thirdweb-dev/react";
import { Button } from "react-bootstrap";

const firstLoadStart = Math.floor(Date.now() / 1000);

const metamask = metamaskWallet();

function popUpWasBlocked(popUp: Window | null) {
  return !popUp || popUp.closed || typeof popUp.closed === "undefined";
}

interface IRootComponent {
  children: React.ReactNode;
}

const RootComponent: React.FC<IRootComponent> = ({ children }) => {
  const router = useRouter();

  const connect = useConnect();

  useEffect(() => {
    if (!metamask || !getInjectedMetamaskProvider()) {
      alert("Metamask is not installed");
    }
  }, [metamask]);

  // useEffect(() => {
  // 	const newwindow = window.open('https://google.com', '_blank');

  // 	if (popUpWasBlocked(newwindow)) {
  // 		window.open('https://google.com', '', 'popup');
  // 	}
  // }, []);

  /**
   * Eager connect
   */
  // useEffect(() => {
  // 	(async () => {
  // 		if (auth) {
  // 			await auth.connectEagerly();
  // 		}
  // 	})();
  // }, []);

  // const checkForMaintenance = async (config: GQLWebConfigPlay) => {
  // 	try {
  // 		const maintenance = config?.maintenance;

  // 		if (maintenance) {
  // 			if (router.asPath.startsWith('/racing') && maintenance.racing === true) {
  // 				return setIsMaintenance(true);
  // 			}

  // 			if (router.asPath.startsWith('/breeding') && maintenance.breeding === true) {
  // 				return setIsMaintenance(true);
  // 			}

  // 			if (router.asPath.startsWith('/fuse') && maintenance.fuse === true) {
  // 				return setIsMaintenance(true);
  // 			}

  // 			if (router.asPath.startsWith('/renting') && maintenance.renting === true) {
  // 				return setIsMaintenance(true);
  // 			}

  // 			if (router.asPath.startsWith('/my-assets/v1') && maintenance.assets === true) {
  // 				return setIsMaintenance(true);
  // 			}
  // 		}
  // 	} catch (e) {
  // 		console.error(e);
  // 	}

  // 	setIsMaintenance(false);
  // };

  const pushScreenViewEvent = (loadStart: number, loadEnd: number) => {
    const path = router.pathname;
    const name = path.slice(1);

    const { tab, view } = querystring.parse(
      router.asPath.replace(path, "").replace("?", "")
    );
    let screenName = name;
    if (tab) {
      screenName += `/tab=${tab}`;
    }
    if (view) {
      screenName += `/view=${view}`;
    }
  };

  return (
    <>
      {" "}
      <Button
        onClick={async () => {
          try {
            let signer = null;
            let address = null;

            const wallet = await connect(metamask);
            signer = await wallet.getSigner();
            address = await wallet.getAddress();

            const signature = await signer.signMessage("Pegaxy");
          } catch (e) {}
        }}
      >
        <span>Connect Metamask with hook</span>
      </Button>
      {children}
    </>
  );
};

export default RootComponent;
