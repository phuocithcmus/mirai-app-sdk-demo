import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  private currentWindow: Window | null = null;
  open({ uri }: { uri: string }): Promise<void> {
    let test1 = `https://id-dev-v2.mirailabs.co/sign?w=${encodeURIComponent(
      uri
    )}&r=${encodeURIComponent(`https://mirai-app-sdk-demo.vercel.app/`)}`;

    return new Promise((resolve, reject) => {
      const windowObjectReference = window.open("", "popUpDiv");

      if (windowObjectReference) {
        windowObjectReference.document.write(
          '<iframe height="100%" width="100%"  allowTransparency="true" frameborder="0" scrolling="yes" style="width:100%;height:100%;" src="' +
            test1 +
            '" type= "text/javascript"></iframe>'
        );

        this.currentWindow = windowObjectReference;
      }
    });
  }
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentWindow) {
        alert("Closing window");
        this.currentWindow?.close();
      }
    });
  }
}

export { CustomWindow };
