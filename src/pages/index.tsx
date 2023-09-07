import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StyledEngineProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MiraiConnection,
  MiraiSignCore,
  MiraiSignProvider,
} from "@mirailabs-co/miraiid-js";
import ModalConnect from "@/app-components/ModalConnect/ModalConnect";
import ButtonConnect from "@/app-components/ButtonConnect/ButtonConnect";
import ProviderForm from "@/app-components/ProviderForm/ProviderForm";

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
        return (
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
            reconnect={async (accessToken: string) => {
              try {
                if (accessToken) {
                  const connection = await miraiCore?.connect({
                    accessToken,
                  });

                  return connection;
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
          clientId: "a0bac604-0fa4-447a-a3de-4deff02008c4",
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
  }, []);

  useEffect(() => {
    if (window !== undefined && typeof window !== "undefined") {
      const conns = JSON.parse(
        window.localStorage.getItem("connections") as string
      ) as {
        id: string;
        userId: string;
        action: ReactNode;
      }[];

      if (conns) {
        conns.forEach((conn) => {
          setConnectionRows((conns) => {
            const has = conns.findIndex((c) => c.id === conn.id) > -1;

            if (!has) {
              return [
                ...conns,
                {
                  id: conn.id,
                  userId: conn.userId,
                  action: "",
                },
              ];
            }

            return [...conns];
          });
        });
      }
    }
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
        connections.forEach((conn) => {
          setConnectionRows((conns) => {
            const has = conns.findIndex((c) => c.id === conn.topicId) > -1;

            if (!has) {
              return [
                ...conns,
                {
                  id: conn.topicId,
                  userId: conn.accessToken,
                  action: "",
                },
              ];
            }

            return [...conns];
          });
        });
      }
    }
  };

  useEffect(() => {
    if (miraiCore) {
      miraiCore?.on("disconnected", async (connection: MiraiConnection) => {
        if (!connection) {
          toastError("Connected reset ");
        } else {
          toastError(`Disconnected ${connection.topicId} `);
          await refectchConn();
        }
      });
    }
  }, [miraiCore]);

  useEffect(() => {
    (async () => {
      await refectchConn();
    })();
  }, [miraiCore]);

  return (
    <StyledEngineProvider injectFirst>
      <ProviderForm
        provider={provider}
        isOpen={openModalRequest}
        onClose={() => {
          setOpenModalRequest(false);
        }}
      />
      <ModalConnect
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
          <Button onClick={handleClickOpen} variant="contained">
            New Connection
          </Button>
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
