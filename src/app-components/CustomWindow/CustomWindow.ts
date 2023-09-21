import { AbstractMiraiWindow } from "@mirailabs-co/miraiid-js";

class CustomWindow extends AbstractMiraiWindow {
  open({ uri }: { uri: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      window.open(uri);
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
