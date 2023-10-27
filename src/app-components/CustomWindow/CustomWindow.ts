import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  private currentWindow: Window | null = null;
  open({ uri }: { uri: string }): Promise<void> {
    let test1 = `https://id-dev-v2.mirailabs.co/sign?w=${encodeURIComponent(
      uri
    )}&r=${encodeURIComponent(`https://mirai-app-sdk-demo.vercel.app/`)}`;

    return new Promise((resolve, reject) => {
      const windowObjectReference = window.open(
        "",
        "popUpDiv",
        "fullscreen=yes,resizable=yes,width=320,height=720"
      );

      if (windowObjectReference) {
        windowObjectReference.document.write(
          '<iframe allowfullscreen height="720" width="360"  allowTransparency="true" frameborder="0" scrolling="yes" style="border: 0;height: 720px;left: 0;position: absolute;top: 0;width: 320px;" src="' +
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
