// position.js
const initDom = () => {
  document.onmousedown = (e) => {
    if (e.shiftKey && e.button === 0) {
      e.preventDefault();
      sendRequestToOpenFileInEditor(getFilePath(e));
    }
  };
};

const getFilePath = (e) => {
  let element = e;
  if (e.target) element = e.target;

  if (!element || !element.getAttribute) return null;

  if (element.getAttribute("code-location")) return element.getAttribute("code-location");
  return this.getFilePath(element.parentNode);
};

const sendRequestToOpenFileInEditor = (filePath) => {
  const protocol = window.location.protocol ? window.location.protocol : "http:";
  const hostname = window.location.hostname ? window.location.hostname : "localhost";

  const port = 8999;

  fetch(`${protocol}//${hostname}:${port}?filePath=${filePath}`).catch((error) => console.log(error));
};

export default {
  initDom,
};
