import { Button } from "@mui/material";
import {
  ConnectWallet,
  SignerOrProvider,
  metamaskWallet,
  useAddress,
  useConnect,
  useSigner,
} from "@thirdweb-dev/react";
import { getInjectedMetamaskProvider } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";

const metamask = metamaskWallet();

const WalletPage = () => {
  const connect = useConnect();
  //   const [signer, setSigner] = useState<SignerOrProvider | null>(null);
  //   const [address, setAddress] = useState<string | null>(null);

  const signer = useSigner();
  const address = useAddress();
  const [connecting, setConnecting] = useState<boolean>(false);
  const [walletStr, setWalletStr] = useState<string>("");

  useEffect(() => {
    if (!metamask || !getInjectedMetamaskProvider()) {
      alert("Metamask is not installed");
    }
  }, [metamask]);

  return (
    <>
      <>
        <Button
          onClick={async () => {
            setConnecting(true);
            const wallet = await connect(metamask);
            setWalletStr(JSON.stringify(wallet));

            // const signer = await wallet.getSigner();
            // setSigner(signer);
            // setAddress(await signer.getAddress());
            setConnecting(false);
          }}
        >
          {connecting ? (
            <span>connecting...</span>
          ) : (
            <span>Connect Metamask with hook</span>
          )}
        </Button>
      </>

      <ConnectWallet
        theme="dark"
        modalSize="compact"
        className="btn flex-grow-1"
        btnTitle={(<span>Connect Wallet default Thirdweb</span>) as any}
      />

      {signer && address && (
        <div>
          <p>Connected to Metamask</p>
          <p>{address}</p>
          <p>wallet: {walletStr}</p>
        </div>
      )}
    </>
  );
};

export default WalletPage;
