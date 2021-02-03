export const isElectron = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(" electron/") > -1;
};

export const copyToClipboard = (value: string | number): void => {
  if (isElectron()) {
    sendMessageToParent(`copyToClipboard: ${value}`);
    return;
  }
  navigator.clipboard.writeText(value.toString());
};

export const openLink = (url: string): void => {
  if (isElectron()) {
    sendMessageToParent(`openLink: ${url}`);
    return;
  }
  window.open(url, "_blank", "noopener");
};

export const logError = (err: string): void => {
  if (isElectron()) {
    sendMessageToParent(`logError: ${err}`);
    return;
  }
  console.log(err);
};

export const sendMessageToParent = (message: string): void => {
  window.parent.postMessage(message, "*");
};
