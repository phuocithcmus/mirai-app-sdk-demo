import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  open({ uri }: { uri: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      window.open(
        `http://id-web-local.mirailabs.co/sign?w=${encodeURIComponent(uri)}`
      );
    });
  }
  close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onOpen(payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      alert(payload);
    });
  }
  onClose(payload: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export { CustomWindow };
