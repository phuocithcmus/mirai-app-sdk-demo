import { MiraiWeb3Modal } from "@mirailabs-co/mirai-web3-modal";
import { MiraiConnection, MiraiSignProvider } from "@mirailabs-co/miraiid-js";
import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import isMobile from "is-mobile";

export interface IButtonConnect {
  id: string;
  accessToken: string;
  reconnect: (accessToken: string) => Promise<MiraiConnection | undefined>;
  onShowModal: (
    miraiConnection: MiraiConnection
  ) => Promise<string | undefined>;
  initMiraiProvider: (provider: MiraiSignProvider) => void;
  showRequestModal: (provider: MiraiSignProvider) => void;
  connnection: MiraiConnection | null;
}

const ButtonConnect = (props: IButtonConnect) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [disconnecting, setDisconnecting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<MiraiSignProvider | null>(null);

  const web3Modal = useRef<MiraiWeb3Modal | null>(null);

  const [status, setStatus] = useState<"approved" | "rejected" | null>(null);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [miraiConnection, setMiraiConnection] =
    useState<MiraiConnection | null>(props.connnection);

  alert(props.connnection?.wcTopicId);

  const toastSuccess = (msg: string) => {
    toast.success(msg, {
      style: {
        wordBreak: "break-all",
      },
    });
  };

  const toastError = (msg: string) => {
    toast.error(msg, {
      style: {
        wordBreak: "break-all",
      },
    });
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       const conn = await props.reconnect(props.accessToken);
  //       setMiraiConnection(conn);
  //     } catch (e: any) {
  //       toastError(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      if (miraiConnection) {
        miraiConnection
          .on("approved", async ({ topicId }) => {
            const provider = await miraiConnection?.getProvider();

            if (provider) {
              //   props.initMiraiProvider(provider);

              setProvider(provider);
            }

            setStatus("approved");

            await web3Modal.current?.closeModal();
          })
          .on("rejected", async ({ message }) => {
            await web3Modal.current?.closeModal();
            setStatus("rejected");
          })
          .on("error", async ({ message }) => {
            await web3Modal.current?.closeModal();
            toastError(message);
          });
      }
    })();
  }, [miraiConnection]);

  useEffect(() => {
    if (status === "approved") {
      toastSuccess("User approved session");
    } else if (status === "rejected") {
      toastError("User rejected method");
    }
  }, [status]);

  const renderTextButton = () => {
    if (!miraiConnection) {
      return "Connect";
    }

    return "Show QRCode";
  };

  if (loading || disconnecting)
    return (
      <Box display={"flex"}>
        <CircularProgress
          style={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
          }}
        />{" "}
        {loading && "Reconnecting ..."}
        {disconnecting && "Disconnecting ..."}
      </Box>
    );

  const openTab = (url: string) => {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = "_blank";
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    a.dispatchEvent(e);
  };

  return (
    <>
      {miraiConnection && (
        <Button
          style={{ marginRight: "8px" }}
          disabled={connecting}
          onClick={async () => {
            try {
              setDisconnecting(true);
              await miraiConnection.disconnect();
            } catch (e: any) {
              toastError(e.message);
            } finally {
              setDisconnecting(false);
            }
          }}
          variant="contained"
        >
          Disconnect
        </Button>
      )}
      <Button
        disabled={connecting}
        onClick={async () => {
          try {
            setConnecting(true);

            if (miraiConnection) {
              const uri = await props.onShowModal(miraiConnection);
              if (uri) {
                // if (!isMobile()) {

                // } else {
                //   window.location.href = `/sign?w=${encodeURIComponent(uri)}`;
                // }

                const web3modal = new MiraiWeb3Modal();
                if (web3modal) {
                  alert(
                    `${uri}&redirect=https://mirai-app-sdk-demo.vercel.app`
                  );
                  await web3modal.openModal({
                    uri,
                    redirectUrl:
                      "safari-https://www.mirai-app-sdk-demo.vercel.app",
                  });

                  web3Modal.current = web3modal;
                }
              }
            } else {
              const conn = await props.reconnect(props.accessToken);
              if (conn) {
                setMiraiConnection(conn);
              }
            }
          } finally {
            setConnecting(false);
          }
        }}
        variant="contained"
      >
        {renderTextButton()}
      </Button>
      {provider && (
        <Button
          style={{ marginLeft: "8px" }}
          disabled={connecting}
          onClick={async () => {
            try {
              props.showRequestModal(provider);
            } finally {
              setConnecting(false);
            }
          }}
          variant="contained"
        >
          Request
        </Button>
      )}
    </>
  );
};

export default ButtonConnect;
