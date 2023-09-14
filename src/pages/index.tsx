import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StyledEngineProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  IAuthClient,
  AuthClient,
  MiraiConnection,
  MiraiSignCore,
  MiraiSignProvider,
  AuthEngineTypes,
} from "@mirailabs-co/miraiid-js";
import ModalConnect from "@/app-components/ModalConnect/ModalConnect";
import ButtonConnect from "@/app-components/ButtonConnect/ButtonConnect";
import ProviderForm from "@/app-components/ProviderForm/ProviderForm";
import axios from "axios";
import jwt_decode from "jwt-decode";

function start_and_end(str: string) {
  if (str) {
    if (str.length > 35) {
      return (
        str.substr(0, 20) + "..." + str.substr(str.length - 10, str.length)
      );
    }
    return str;
  }
  return "";
}

const Home = () => {
  const [open, setOpen] = useState(false);
  const [openModalRequest, setOpenModalRequest] = useState(false);

  const [miraiCore, setMiraiCore] = useState<MiraiSignCore | null>(null);

  const [provider, setProvider] = useState<MiraiSignProvider | null>(null);
  const [auth_client, setAuthClient] = useState<IAuthClient | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const [connectionRows, setConnectionRows] = useState<
    {
      id: string;
      userId: string;
      action: ReactNode;
    }[]
  >([]);

  const showRequestModal = (provider: MiraiSignProvider) => {
    setOpenModalRequest(true);
    setProvider(provider);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Topic ID",
      width: 333,
      // editable: true,
      renderCell: (params) => {
        return <>{start_and_end(params.value)}</>;
      },
    },
    {
      field: "userId",
      headerName: "Access Token",
      width: 333,
      // editable: true,
      renderCell: (params) => {
        return <>{start_and_end(params.value)}</>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 333,
      // editable: true,
      renderCell: (params) => {
        alert(miraiCore?.connections[params.row["id"]]);
        return (
          <>
            {miraiCore && (
              <ButtonConnect
                showRequestModal={showRequestModal}
                initMiraiProvider={(provider) => {
                  if (provider) {
                    setProvider(provider);
                    setOpenModalRequest(true);
                  }
                }}
                accessToken={params.row["userId"]}
                id={params.id as string}
                onShowModal={async (miraiConnection: MiraiConnection) => {
                  return await showModal(miraiConnection);
                }}
                connnection={miraiCore?.connections[params.row["id"]] ?? null}
                reconnect={async (accessToken: string) => {
                  try {
                    if (accessToken) {
                      const connection = (await miraiCore?.connect({
                        accessToken,
                      })) as MiraiConnection;

                      if (connection) {
                        return connection;
                      }
                    } else {
                      toastError("Not found access token");
                    }
                  } catch (e: any) {
                    toastError(e);
                  } finally {
                    await refectchConn();
                  }
                }}
              />
            )}
          </>
        );
      },
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    await refectchConn();
    setOpen(false);
  };

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

  // FOR SDK CLIENT
  useEffect(() => {
    (async () => {
      try {
        const miraiCore = await MiraiSignCore.init({
          clientId: "24f0da89-b26f-492f-9818-4f0ab4fcdfe7",
          chainNameSpace: "eip155",
          chains: ["0x38", "0x1"],
          // defaultChainId: "0x38",
          metaData: {
            name: "Mirai App",
            description: "Mirai App",
            icons: [""],
          },
          redirectUri: "https://miraiid.io",
        });

        if (miraiCore) {
          toastSuccess("Initialized MiraiCore");
        }

        setMiraiCore(miraiCore);
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      alert("Unmount ne");
    };
  }, []);

  const showModal = async (miraiConnection: MiraiConnection) => {
    if (miraiCore && miraiConnection) {
      try {
        const { uri } = await miraiCore.showConnectionModal(miraiConnection);
        console.log("uri", uri);

        return uri;
      } catch (e: any) {
        toastError(e.message);
      }
    }
  };

  const refectchConn = async () => {
    if (miraiCore) {
      console.log("miraiCore.connections", await miraiCore.getAllConnection());
      const connections = Object.values(miraiCore.connections);

      if (window !== undefined && typeof window !== "undefined") {
        window.localStorage.setItem(
          "connections",
          JSON.stringify(
            connections.map((e) => {
              return {
                id: e.topicId,
                userId: e.accessToken,
                action: "",
              };
            })
          )
        );
      }

      if (connections.length === 0) {
        setConnectionRows([]);
      } else {
        setConnectionRows(
          connections.map((conn) => {
            return {
              id: conn.topicId,
              userId: conn.accessToken,
              action: "",
            };
          })
        );
      }
    }
  };

  useEffect(() => {
    if (miraiCore) {
      miraiCore
        ?.on("disconnected", async ({ connection, reason }) => {
          if (!connection) {
            toastError("Connected reset ");
          } else {
            toastError(`Disconnected ${connection.topicId} ${reason}`);
            setAccessToken(null);
            setUserId(null);

            await refectchConn();
          }
        })
        .on("reconnecting", () => {
          toastSuccess("Reconnecting");
        })
        .on("reconnected", async (connection) => {
          alert(`reconnected ${JSON.stringify(miraiCore)}`);
          await refectchConn();
        });
    }
  }, [miraiCore]);

  useEffect(() => {
    (async () => {
      // Initialize client make
      const client = await AuthClient.init({
        name: "mirai app test sdk",
        mode: "development",
        clientId: "24f0da89-b26f-492f-9818-4f0ab4fcdfe7",
        authorizationCallbackFunc: async ({ code, state }) => {
          // perform with code, state here
          console.log(code, state);
          setIsFetchingUser(true);

          const { data } = await axios.post(
            `api/auth/token?code=${code}&state=${state}`,
            {}
          );

          console.log("access_token", data.access_token);

          setAccessToken(data.access_token);

          const { sub } = jwt_decode(data.access_token) as { sub: string };
          setUserId(sub);
          setIsFetchingUser(false);
        },
        autoStart: false, // Default: false, set "true" if you need automatic start after 'init' done
      });

      await client.start();

      setAuthClient(client);
    })();
  }, [miraiCore]);

  return (
    <StyledEngineProvider injectFirst>
      {openModalRequest && (
        <ProviderForm
          provider={provider}
          isOpen={openModalRequest}
          onClose={() => {
            setOpenModalRequest(false);
          }}
        />
      )}

      {accessToken && (
        <ModalConnect
          accessToken={accessToken}
          // accessToken="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIyNGYwZGE4OS1iMjZmLTQ5MmYtOTgxOC00ZjBhYjRmY2RmZTciLCJqdGkiOiJmZjQ3MDk0Ni1lN2IxLTQ1MDgtYTk4NS02ZmY5ZGJiYjMwMTciLCJleHAiOjE2OTQ0OTMwMzEsInN1YiI6ImJmYjRmZmY2LWUzMTQtNDI2OS1iYTAyLWRmYzU5MTk1MzRjZiIsInNjb3BlcyI6WyJwcm9maWxlIl0sImVtYWlsIjoiZHVjcGh1b2MudDlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJQaMaw4bubYyBOZ3V54buFbiDEkOG7qWMiLCJnaXZlbl9uYW1lIjoiUGjGsOG7m2MiLCJmYW1pbHlfbmFtZSI6Ik5ndXnhu4VuIMSQ4bupYyIsImlzcyI6Imh0dHBzOi8vaWQtZGV2LXYyLm1pcmFpbGFicy5jbyIsImF6cCI6IjI0ZjBkYTg5LWIyNmYtNDkyZi05ODE4LTRmMGFiNGZjZGZlNyIsImlhdCI6MTY5NDQwNjYzMX0.G12P9qQ0oNT7HJ344jf0sd3sEXr4Y1W4HkFmvgc2SvPnIOCw-xttiur1I9N4Wn9uf5igw8m0kfQqTBu-gQAh4kTKeWAt9w3PpFV_P3fFUqsMV-KENadv1mDVLts0yDkVn6o5uek8hHWFpUaYXY8iRcCkaONBq7Btb4nILltxx_g_kWJ2EP69aavlYajIFtHIIqW6qfJ7FMdYR7ShZFYU3SHeZBCDd3XxNJtiS99--TU9xMMaAWzQ4xT8SW4U0P0DXKFnXr8i2Dm1xIFFVaEiU44UYk8gKjyT3bDYQqBoz46rdLm4capPBUYP3aUsTH4C9CILlwleUiVG1pvTzI3awuGMRHywj_kNlzXp91J6DYUZYrhrRE3B57804a45MN91a-1yw0hGr67ffTO-9dwuGNkRFFivsLB0bdNap93kvHhVjbcGF_UVJvT_MSMgeh_yPreCNDI7fjVSYOJU1PrqIYcG2UnT4fWh1hss6Ynrlj27DVs3Sgrhx-K4AcSo8mM3EvKeij2o3_fRQcdcz4ANS0lt3FF7eU_WOcuVGpWwVZhUffCYpmwq7VIlgUQWkqkCIINI5LTHVQTE89zfJREetTep6DEp1xRC01Jj6hNkYrtZnZpywg0zJG1vzQqFdGHFy1gR5me5WU_KeKbNKaRwuQ0pzfLz_Qk-nhS7FYo8s8Q"
          open={open}
          handleClose={handleClose}
          handleConnect={async (accessToken: string) => {
            try {
              if (accessToken) {
                const connection = await miraiCore?.connect({
                  accessToken,
                });
                if (connection) {
                  toastSuccess("Initialized Mirai Connection");
                }
              } else {
                toastError("Not found access token");
              }
            } catch (e: any) {
              toastError(e.message);
            } finally {
              await refectchConn();

              await handleClose();
            }
          }}
        />
      )}

      <Box
        sx={{
          p: 2,
          height: "100vh",
          margin: "auto",
        }}
      >
        <Grid
          sx={{
            p: 2,
            margin: "auto",
            maxWidth: 1280,
          }}
          spacing={2}
        >
          <Button
            onClick={async () => {
              if (auth_client) {
                // make the authorization request
                await auth_client.request({
                  redirect_uri: "https://mirai-app-sdk-demo.vercel.app",
                  code_challenge_method: "S256",
                  origin: "https://mirai-app-sdk-demo.vercel.app",
                } as AuthEngineTypes.RequestParams);
              }
            }}
            variant="outlined"
          >
            Login another user
          </Button>
          {(userId || isFetchingUser) && (
            <Button
              disabled={isFetchingUser}
              style={{ marginLeft: "8px" }}
              onClick={handleClickOpen}
              variant="contained"
            >
              {isFetchingUser
                ? "fetching mirai user ..."
                : ` New Connection ${userId && `- ${userId}`}`}
            </Button>
          )}
        </Grid>

        <Grid
          sx={{
            p: 2,
            minHeight: 500,
            margin: "auto",
            maxWidth: 1280,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          container
          spacing={2}
        >
          <DataGrid
            autoHeight
            rows={connectionRows}
            columns={columns}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            keepNonExistentRowsSelected
          />
        </Grid>
      </Box>
    </StyledEngineProvider>
  );
};

export default Home;
