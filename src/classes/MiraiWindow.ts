class MiraiWindow {
  // eslint-disable-next-line no-undef
  public static currentWindow: Window;

  static windowResize(topicId: string) {
    try {
      if (document) {
        var contentWidth = document.getElementById(topicId)?.offsetWidth;
        var contentHeight = document.getElementById(topicId)?.offsetHeight;
        if (contentWidth && contentHeight) {
          window.resizeTo(contentWidth, contentHeight);
        }
      }
    } catch (e) {}
  }

  static async open(url: string, name: string, topic: string) {
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=380, height=520, top=200, left=300";

    let windowObjectReference = window.open(url, name, strWindowFeatures);

    if (windowObjectReference) {
      windowObjectReference.focus();

      window.addEventListener("message", (event) => {
        const { data } = event;
        const { topicId, message } = data;

        if (topicId === topic) {
          if (message === "user_approved" || message === "user_rejected") {
            windowObjectReference?.close();
          }
        }
      });

      window.addEventListener("message", (e) => {
        const { data } = e;
        console.log(data);
        const { event } = data;
        if (event === "window_closed") {
        }
      });

      this.currentWindow = windowObjectReference;
    }
  }

  static async close() {
    this.currentWindow.close();
  }
}

export default MiraiWindow;
