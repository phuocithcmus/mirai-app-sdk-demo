import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";

export interface IModalConnect {
  open: boolean;
  handleClose: () => void;
  handleConnect: (accessToken: string) => Promise<void>;
}

const ModalConnect = (props: IModalConnect) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Open new connection </DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To open new mirai connection, please enter your miraiid access token.
        </DialogContentText> */}
        <TextField
          style={{ width: "100%", margin: "5px" }}
          multiline
          value={accessToken}
          autoFocus
          id="name"
          label="Access Token"
          fullWidth
          variant="standard"
          onChange={(evt) => {
            setAccessToken(evt.target.value);
          }}
          required={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={connecting}
          onClick={async () => {
            try {
              setConnecting(true);
              await props.handleConnect(accessToken);
            } finally {
              setConnecting(false);
            }
          }}
        >
          {`Connect${connecting ? "ing" : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConnect;
