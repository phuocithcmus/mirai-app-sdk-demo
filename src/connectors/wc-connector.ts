import { Web3ReactHooks, initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

const WALLET_CONNECT_PROJECT_ID = "64ba7104bc1c99300009f9fb4daea553";

export const MAINNET_CHAINS = [80001, 137, 1, 10, 42161, 42220];

export default (): [WalletConnectV2, Web3ReactHooks] => {
  const [mainnet, ...optionalChains] = MAINNET_CHAINS;
  const [connector, hooks] = initializeConnector<WalletConnectV2>(
    (actions) =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: WALLET_CONNECT_PROJECT_ID,
          chains: [mainnet],
          showQrModal: true,
          metadata: {
            description: "Pegaxy Game",
            name: "Pegaxy",
            url: "https://pegaxy.io/",
            icons: [""],
          },
          optionalChains,
        },
        // defaultChainId,
      })
  );
  return [connector, hooks];
};
