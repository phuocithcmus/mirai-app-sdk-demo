import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  private currentWindow: Window | null = null;
  open({ uri }: { uri: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const windowObjectReference = window.open(
        `http://id-web-local.mirailabs.co/sign?w=${encodeURIComponent(uri)}`
      );

      this.currentWindow = windowObjectReference;
    });
  }
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentWindow) {
        this.currentWindow?.close();
      }
    });
  }
  onOpen(payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      alert(payload);
    });
  }
  onClose(payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      alert(payload);
    });
  }
}

export { CustomWindow };
