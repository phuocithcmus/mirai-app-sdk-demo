import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  private currentWindow: Window | null = null;
  open({ uri }: { uri: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const windowObjectReference = window.open(
        `https://id-dev-v2.mirailabs.co/sign?w=${encodeURIComponent(
          uri
        )}&r=https://mirai-app-sdk-demo.vercel.app/`
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
}

export { CustomWindow };
