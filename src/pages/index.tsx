import { Concert_One, Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
// import {
//   MiraiConnection,
//   MiraiSignCore,
//   MiraiSignProvider,
//   MiraiWindow,
// } from "@mirailabs-co/miraiid-js";
import { io, connect, Socket } from "socket.io-client";
import parser from "socket.io-msgpack-parser";
import QRCode from "qrcode";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  const [message, setMessage] = useState<string>("");
  const [message_unsigned, setMessageUnsigned] = useState<string>("");
  const [status, setStatus] = useState<"approved" | "rejected" | null>(null);
  const [wallet_client, setWalletClient] = useState<any>(null);
  const [onSigning, setOnSigning] = useState<boolean>(false);
  const [topicId, setTopicId] = useState<string>("");
  // const [provider, setProvider] = useState<MiraiSignProvider | null>(null);
  // const [miraiCore, setMiraiCore] = useState<MiraiSignCore | null>(null);
  // const [miraiConnection, setMiraiConnection] =
  //   useState<MiraiConnection | null>(null);
  const [showSignArea, setShowSignArea] = useState<boolean>(false);
  const [isConnectting, setIsConnectting] = useState<boolean>(false);
  const [isGettting, setIsGetting] = useState<boolean>(false);
  const [qrcode, setQrCode] = useState<string>("");
  const [uri, setUri] = useState<string>("");
  const [socketId, setSocketId] = useState<string>("");

  const [accessToken, setAccessToken] = useState<string>("");
  const [chainId, setChainId] = useState<string>("56");
  const [method, setMethod] = useState<string>("personal_sign");
  const [params, setParams] = useState<string>(
    '["phuocnd","0x9f3A5240980a94F6CE5f30c6187d047F6650B9a9"]'
  );

  const socket = io("https://dev-sign-provider.miraiid.io", {
    autoConnect: false,
    reconnection: false,
    transports: ["websocket"],
    upgrade: true,
    withCredentials: true,
    auth: {
      authorization: accessToken,
    },
  });

  // socket.on(socket.id, (e) => {
  //   console.log(e);
  // });

  socket.on("connect", () => {
    console.log("connected");
    toast.success(`WS connected - id: ${socket.id}`);
    setSocketId(`ws connected: id: ${socket.id}`);

    setQrCode("");
    setUri("");
    setTopicId("");
    setMessage("");
    setIsConnectting(false);
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnected", reason);
    setIsConnectting(false);

    toast.error(`WS disconnected - Reason: ${reason}`);

    setMessage(`ws disconnected: reason: ${reason}`);
  });

  socket.on("uri", async (uri) => {
    console.log("uri", uri);

    toast.success(`New URI received - uri: ${uri}`);

    setUri(uri);
    setQrCode(await QRCode.toDataURL(uri));
  });

  socket.on("topic", (topic) => {
    console.log("topic", topic);
    setTopicId(topic);
  });

  socket.on("error-topic", (message) => {
    console.log("error-topic", message);

    toast.error(`error-topic - message: ${message}`);
    setMessage(message);
  });

  socket.on("error", (message) => {
    console.log("error", message);
    setMessage(message);

    toast.error(`error - message: ${message}`);

    setIsConnectting(false);
  });

  socket.on("response", (response) => {
    console.log("error", response);
    toast(`Received message: ${response}`);
    setMessage(response);
  });

  // FOR SDK CLIENT
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const miraiCore = await MiraiSignCore.init({
  //         clientId: "a0bac604-0fa4-447a-a3de-4deff02008c4",
  //         chainNameSpace: "eip155",
  //         chains: ["0x38", "0x893"],
  //         metaData: {
  //           name: "Mirai App",
  //           description: "Mirai App",
  //           icons: [""],
  //         },
  //         onOpenConnectionModal: async (
  //           connnection: MiraiConnection,
  //           url: string
  //         ) => {
  //           console.log("url", new URL(url));
  //           console.log("connnection", connnection);

  //           await MiraiWindow.open(url, "Mirai App", connnection.topicId);
  //         },
  //         onCloseConnectionModal: async (connnection: MiraiConnection) => {
  //           setMiraiConnection(null);
  //         },
  //         redirectUri: "https://miraiid.io",
  //       });

  //       setMiraiCore(miraiCore);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   })();
  // }, []);

  // const showModal = async () => {
  //   if (miraiCore && miraiConnection) {
  //     await miraiCore.showConnectionModal(miraiConnection);
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     if (provider) {
  //       const chainId = (await provider.request({
  //         method: "eth_chainId",
  //       })) as string;
  //       const account = await provider.enable();

  //       setAccount(account[0]);
  //       setChainId(chainId);
  //     }
  //   })();
  // }, [provider]);
  // // FOR SDK CLIENT

  // useEffect(() => {
  //   (async () => {
  //     if (miraiConnection) {
  //       miraiConnection
  //         .on("approved", async ({ topicId }) => {
  //           setProvider(await miraiConnection.getProvider());
  //           setStatus("approved");
  //         })
  //         .on("rejected", (e) => {
  //           setStatus("rejected");
  //         });
  //       await showModal();
  //       console.log("miraiConnection", miraiConnection);
  //     }
  //   })();
  // }, [miraiConnection]);

  // useEffect(() => {
  //   if (status === "approved") {
  //     alert("approved");
  //   }
  // }, [status]);

  const getTopic = async () => {
    try {
      const topic = await axios.get(
        "https://dev-sign-provider.miraiid.io/api/provider",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (e) {}
  };

  const request = async (
    topicId: string,
    chainId: string,
    method: string,
    params: string
  ) => {
    try {
      const topic = await axios.put(
        `https://dev-sign-provider.miraiid.io/api/provider/send-request/${topicId}`,
        {
          chainId: `eip155:${chainId}`,
          request: {
            method,
            params: JSON.parse(params),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Mirai App SDK Demo
        </p>
      </div>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Access Token"
        onChange={(evt) => {
          setAccessToken(evt.target.value);
        }}
      />
      <p>{socketId}</p>
      <p>Message: {message}</p>
      <div></div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <a
          style={{ wordBreak: "break-word" }}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* <h2 className={`mb-3 text-2xl font-semibold`}>
            Account:
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{account}</p> */}
          {qrcode && <img src={qrcode} alt="qrcode" />}
        </a>
        <div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{uri}</p>

          {topicId && (
            <>
              <div
                style={{ marginTop: "20px", marginBottom: "20px" }}
                className={`m-0 max-w-[30ch] text-sm opacity-50`}
              >
                <p style={{ fontWeight: "bold" }}>Topic:</p> {topicId}
              </div>
              <input
                style={{ marginBottom: "20px" }}
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ChainId"
                onChange={(evt) => {
                  setChainId(evt.target.value);
                }}
              />
              <input
                type="text"
                style={{ marginBottom: "20px" }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Method"
                onChange={(evt) => {
                  setMethod(evt.target.value);
                }}
              />
              <textarea
                style={{ marginBottom: "20px" }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Params"
                onChange={(evt) => {
                  setParams(evt.target.value);
                }}
                rows={10}
              />
            </>
          )}
        </div>
      </div>
      <div className="relative flex place-items-center ">
        <>
          <button
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            onClick={async () => {
              setIsConnectting(true);
              socket.connect();
            }}
          >
            {isConnectting ? "Connectting" : "Connect"}
          </button>
          <button
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={async () => {
              setIsGetting(true);

              await getTopic();

              setIsGetting(false);
            }}
          >
            {isGettting ? "watting..." : "Get QRCode"}
          </button>
          <button
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={async () => {
              setIsGetting(true);

              await request(topicId, chainId, method, params);

              setIsGetting(false);
            }}
          >
            {isGettting ? "watting..." : "Request"}
          </button>
        </>
        {/* {isConnectting ||
          (miraiConnection && (
            <button className="block text-white bg-green-700  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
              {isConnectting
                ? `Connectting`
                : `${status === null ? "Connected" : status.toUpperCase()}`}
            </button>
          ))} */}
      </div>
    </main>
  );
}
