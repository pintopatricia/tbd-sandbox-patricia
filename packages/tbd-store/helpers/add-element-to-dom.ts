export const addElementToDOM = (targetDOMElement: HTMLElement, element: HTMLElement): void => {
  if (!targetDOMElement.contains(element)) {
    targetDOMElement.appendChild(element);
  }
};

type InjectedScript = {
  type?: HTMLScriptElement["type"];
  async?: string;
  src: HTMLScriptElement["src"];
  [key: string]: any;
};

export const DEFAULT_INJECTED_SCRIPT_PROPS = {
  type: "text/javascript",
  async: "true",
};

export const injectScript = (script: InjectedScript): void => {
  const scriptElement = document.createElement("script");

  Object.entries({
    ...DEFAULT_INJECTED_SCRIPT_PROPS,
    ...script,
  }).forEach(([key, value]): void => {
    scriptElement.setAttribute(key, value);
  });

  addElementToDOM(document.head, scriptElement);
};
