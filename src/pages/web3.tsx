import {
  useWeb3React,
  Web3ReactProvider,
  Web3ReactHooks,
} from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import wcConnector, { MAINNET_CHAINS } from "../connectors/wc-connector";
import { useEffect } from "react";
import {
  useAuthentication,
  WalletName,
  useActiveWeb3React,
} from "@pegaxy/auth-sdk";

// const [walletConnectV2, walletConnectV2Hooks] = wcConnector();

const SUPPORTED_WALLETS = [
  WalletName.MetaMask,
  WalletName.Coinbase,
  WalletName.WalletConnect,
  WalletName.EIP1193,
  WalletName.StandaloneEIP1193,
];
export function getName(connector: Connector) {
  if (connector instanceof WalletConnectV2) return "WalletConnect V2";
  return "Unknown";
}

// const connectors: [WalletConnectV2, Web3ReactHooks][] = [
//   [walletConnectV2, walletConnectV2Hooks],
// ];

function Child({ wallet }: any) {
  console.log(wallet);

  const { account, isActive } = useActiveWeb3React();

  useEffect(() => {
    (async () => {
      if (wallet) {
        const [connector, _] = wallet;
        await connector.activate();

        console.log(`Priority Connector is:connector}`, getName(connector));
      }
    })();
  }, [wallet]);

  useEffect(() => {
    (async () => {
      const [connector, _] = wallet;
      if (!isActive) {
        await connector.connectEagerly();
      } else {
        console.log(account);
      }
    })();
  }, [account, isActive]);

  return (
    <button
      onClick={async () => {
        if (wallet) {
          const [connector, _] = wallet;
          await connector.deactivate();

          console.log(`Priority Connector is:connector}`, getName(connector));
        }
      }}
    >
      Disconnect
    </button>
  );
}

export default function ProviderExample() {
  const auth_client = useAuthentication(
    80001,
    {
      appName: "Pegaxy",
      appLogo:
        "https://cdn.pegaxy.io/statics/play/public/v11/images/pegaxy.png",
      allowedWallets: SUPPORTED_WALLETS,
      allowedchains: MAINNET_CHAINS,
    },
    [2195]
  );

  return (
    <Web3ReactProvider connectors={auth_client.auth.connectors}>
      <Child wallet={auth_client.auth.getConnector(WalletName.WalletConnect)} />
    </Web3ReactProvider>
  );
}
