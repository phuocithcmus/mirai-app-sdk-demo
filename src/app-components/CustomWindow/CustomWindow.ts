import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

export const SIGN_BASE_URL = "http://mirai-app-sdk-demo.vercel.app";

class CustomWindow extends AbstractMiraiWindow {
  private currentWindow: Window | null = null;
  open({ uri }: { uri: string }): Promise<void> {
    let test1 = `https://id-dev-v2.mirailabs.co/sign?w=${encodeURIComponent(
      uri
    )}&r=${encodeURIComponent(`https://mirai-app-sdk-demo.vercel.app/`)}`;

    return new Promise((resolve, reject) => {
      let width = window.innerWidth;
      let height = window.innerHeight;
      const windowObjectReference = window.open(
        test1,
        "",
        `fullscreen=yes,resizable=yes,width=${width},height=${height}`
      );

      // if (windowObjectReference) {
      //   windowObjectReference.document.write(
      //     `<iframe height="100%" width="100%"  allowTransparency="true" frameborder="0" scrolling="yes" style="border: 0;left: 0;position: absolute;top: 0;" src=" ${test1}
      //    " type= "text/javascript"></iframe>`
      //   );
      // }
      this.currentWindow = windowObjectReference;
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
