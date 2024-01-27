import { Button } from "@mui/material";
import {
  SignerOrProvider,
  metamaskWallet,
  useAddAdmin,
  useAddress,
  useConnect,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { getInjectedMetamaskProvider } from "@thirdweb-dev/wallets";

const metamask = metamaskWallet();

const WalletPage = () => {
  const connect = useConnect();
  const [signer, setSigner] = useState<SignerOrProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!metamask || !getInjectedMetamaskProvider()) {
      alert("Metamask is not installed");
    }
  }, [metamask]);

  return (
    <>
      <Button
        onClick={async () => {
          const wallet = await connect(metamask);

          const signer = await wallet.getSigner();
          setSigner(signer);
          setAddress(await signer.getAddress());
        }}
      >
        Connect Metamask
      </Button>

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
