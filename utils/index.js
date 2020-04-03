import FontFaceObserver from "fontfaceobserver";

const preloadIdleFont = () => {
  const link = document.createElement("link");

  link.href = "https://fonts.googleapis.com/css?family=Open+Sans&display=swap";
  link.rel = "stylesheet";

  document.head.appendChild(link);

  const roboto = new FontFaceObserver("Roboto");

  roboto.load().then(() => {
    document.documentElement.classList.add("roboto");
  });
};

export { preloadIdleFont };
