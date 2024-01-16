// position.js
export const initDom = () => {
  document.onmousedown = (e: MouseEvent) => {
    if (e.shiftKey && e.button === 0) {
      e.preventDefault();

      const path = getFilePath(e);
      path && sendRequestToOpenFileInEditor(path);
    }
  };
};

type IOverload = {
  (e: ParentNode): string | undefined;
  (e: MouseEvent): string | undefined;
};

const getFilePath: IOverload = (e: MouseEvent | ParentNode) => {
  let element: HTMLElement | undefined;

  if (e instanceof MouseEvent) element = e.target as HTMLElement;
  if (e instanceof HTMLElement) element = e;

  if (!element || !element.getAttribute) return undefined;

  if (element.getAttribute("data-code-location")) return element.getAttribute("data-code-location") ?? "";

  if (element.parentNode) return getFilePath(element.parentNode);
};

const sendRequestToOpenFileInEditor = (filePath: string) => {
  const protocol = window.location.protocol ? window.location.protocol : "http:";
  const hostname = window.location.hostname ? window.location.hostname : "localhost";

  const port = 8111;

  fetch(`${protocol}//${hostname}:${port}?filePath=${filePath}`).catch((error) => console.log(error));
};
