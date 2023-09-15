import { MiraiWeb3Modal } from "@mirailabs-co/mirai-web3-modal";
import {
  MiraiConnection,
  MiraiSignCore,
  MiraiSignProvider,
} from "@mirailabs-co/miraiid-js";
import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export interface IButtonConnect {
  id: string;
  accessToken: string;
  reconnect: (accessToken: string) => Promise<MiraiConnection | undefined>;
  onShowModal: (
    miraiConnection: MiraiConnection
  ) => Promise<string | undefined>;
  initMiraiProvider: (provider: MiraiSignProvider) => void;
  showRequestModal: (provider: MiraiSignProvider) => void;
  reloadProvider?: boolean;
  miraiCore: MiraiSignCore;
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
    useState<MiraiConnection | null>(null);

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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const conn = await props.reconnect(props.accessToken);
        if (conn) {
          setMiraiConnection(conn);
        }
      } catch (e: any) {
        toastError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (props.reloadProvider) {
        setMiraiConnection(props.miraiCore.connections[props.id]);

        const provider = await props.miraiCore.connections[
          props.id
        ].getProvider();
        if (provider) {
          setProvider(provider);
        }
      }
    })();
  }, [props.reloadProvider, props.miraiCore]);

  useEffect(() => {
    (async () => {
      if (miraiConnection) {
        miraiConnection
          .on("approved", async ({ topicId }) => {
            const provider = await miraiConnection?.getProvider();

            if (provider) {
              setProvider(provider);
            }

            setStatus("approved");
          })
          .on("rejected", async ({ message }) => {
            setStatus("rejected");
          })
          .on("error", async ({ message }) => {
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
