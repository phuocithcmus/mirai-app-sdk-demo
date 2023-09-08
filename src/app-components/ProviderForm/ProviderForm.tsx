import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import { MiraiSignProvider, RpcMethod } from "@mirailabs-co/miraiid-js";
import { toast } from "react-hot-toast";

export interface IProviderForm {
  provider: MiraiSignProvider | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const ProviderForm = (props: IProviderForm) => {
  const [sending, setSending] = useState<boolean>(false);
  const [method, setMethod] = useState<string>("personal_sign");
  const [params, setParams] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const getDefaultParamsByMethod = (method: string) => {
    switch (method) {
      case "eth_accounts":
        return "[]";
      case "personal_sign":
        return JSON.stringify(["test", "your account"]);
      case "wallet_addEthereumChain":
        return JSON.stringify([
          {
            chainId: "0x64",
            chainName: "Gnosis",
            rpcUrls: ["https://rpc.ankr.com/gnosis"],
            iconUrls: [
              "https://xdaichain.com/fake/example/url/xdai.svg",
              "https://xdaichain.com/fake/example/url/xdai.png",
            ],
            nativeCurrency: {
              name: "xDAI",
              symbol: "xDAI",
              decimals: 18,
            },
            blockExplorerUrls: ["https://blockscout.com/poa/xdai/"],
          },
        ]);
      case "wallet_switchEthereumChain":
        return JSON.stringify([
          {
            chainId: "0x64",
          },
        ]);
      case "eth_chainId":
        return "[]";
      case "eth_getBalance":
        return JSON.stringify(["your address", "Block number"]);
      case "eth_requestAccounts":
        return "[]";
      default:
        break;
    }
  };

  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Mirai Provider</DialogTitle>

      <DialogContent>
        <form style={{ minWidth: "500px" }}>
          <TextField
            disabled
            value={props.provider?.accounts[0]}
            style={{ width: "100%", margin: "5px" }}
            type="text"
            label="Account"
            variant="outlined"
          />
          <TextField
            disabled
            value={props.provider?.chainId}
            style={{ width: "100%", margin: "5px" }}
            type="text"
            label="Chain"
            variant="outlined"
          />

          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            label="Method"
            value={method}
            onChange={(evt) => {
              setParams(null);
              setMethod(evt.target.value);
            }}
            autoWidth
            style={{ width: "100%", margin: "5px" }}
            variant="outlined"
          >
            <MenuItem value={"personal_sign" as RpcMethod}>
              <em>personal_sign</em>
            </MenuItem>
            <MenuItem value={"wallet_addEthereumChain" as RpcMethod}>
              wallet_addEthereumChain
            </MenuItem>
            <MenuItem value={"wallet_switchEthereumChain" as RpcMethod}>
              wallet_switchEthereumChain
            </MenuItem>
            <MenuItem value={"eth_chainId" as RpcMethod}>eth_chainId</MenuItem>
            <MenuItem value={"eth_getBalance" as RpcMethod}>
              eth_getBalance
            </MenuItem>
            <MenuItem value={"eth_accounts" as RpcMethod}>
              eth_accounts
            </MenuItem>
            <MenuItem value={"eth_requestAccounts" as RpcMethod}>
              eth_requestAccounts
            </MenuItem>
          </Select>
          {/* <TextField
            value={method}
            style={{ width: "100%", margin: "5px" }}
            type="text"
            label="Method"
            variant="outlined"
            onChange={(evt) => {
              setMethod(evt.target.value);
            }}
          /> */}
          <TextField
            value={params === null ? getDefaultParamsByMethod(method) : params}
            style={{ width: "100%", margin: "5px" }}
            type="text"
            label="Params"
            variant="outlined"
            multiline
            rows={5}
            onChange={(evt) => {
              setParams(evt.target.value);
            }}
          />
        </form>

        <TextField
          value={response}
          style={{ width: "100%", margin: "5px" }}
          type="text"
          label="Reponse"
          variant="outlined"
          multiline
          rows={5}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            props.onClose();
          }}
          fullWidth
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={sending}
          onClick={async () => {
            try {
              setSending(true);

              const response = await props.provider?.request({
                method: method as RpcMethod,
                params: params ? JSON.parse(params) : null,
              });

              setResponse(JSON.stringify(response));

              toastSuccess("Send successfully");
            } catch (e: any) {
              toastError(e.message);
            } finally {
              setSending(false);
            }
          }}
          fullWidth
          variant="contained"
          color="primary"
        >
          {sending ? "Sending" : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderForm;
