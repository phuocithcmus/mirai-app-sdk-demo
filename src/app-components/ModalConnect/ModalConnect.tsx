import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import jwt_decode from "jwt-decode";

export interface IModalConnect {
  open: boolean;
  accessToken: string | null;
  handleClose: () => void;
  handleConnect: (accessToken: string) => Promise<void>;
}

const ModalConnect = (props: IModalConnect) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    if (props.accessToken) {
      const { sub } = jwt_decode(props.accessToken) as { sub: string };
      setUserId(sub);
    }
  }, [props.accessToken]);

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Open new connection </DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To open new mirai connection, please enter your miraiid access token.
        </DialogContentText> */}
        <form style={{ minWidth: "500px" }}>
          <TextField
            disabled
            value={userId}
            style={{ width: "100%", margin: "5px" }}
            type="text"
            label="Account"
            variant="outlined"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={connecting}
          onClick={async () => {
            try {
              setConnecting(true);
              if (props.accessToken) {
                await props.handleConnect(props.accessToken);
              }
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
