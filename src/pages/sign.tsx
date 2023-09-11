import React, { useEffect, useState } from "react";
import { MiraiWeb3Modal } from "@mirailabs-co/mirai-web3-modal";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

const web3modal = new MiraiWeb3Modal();

const MiraiSignPage = () => {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("w");

    setUri(myParam as string);

    alert("loaded");
  }, []);

  useEffect(() => {
    if (uri) {
      web3modal.openModal({ uri });
    }
  }, [uri]);

  return <></>;
};

export default MiraiSignPage;
