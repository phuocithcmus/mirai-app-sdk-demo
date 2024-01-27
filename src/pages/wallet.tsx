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

            // const signer = await wallet.getSigner();
            // setSigner(signer);
            // setAddress(await signer.getAddress());
            setConnecting(false);
          }}
        >
          Connect Metamask with hook
        </Button>
      </>

      <ConnectWallet
        theme="dark"
        modalSize="compact"
        className="btn flex-grow-1"
        btnTitle={
          (
            <>
              {connecting ? (
                <span>connecting...</span>
              ) : (
                <span>Connect Wallet default Thirdweb</span>
              )}
            </>
          ) as any
        }
      />

      {signer && address && (
        <div>
          <p>Connected to Metamask</p>
          <p>{address}</p>
        </div>
      )}
    </>
  );
};

export default WalletPage;
