export async function triggerPaymentsWebEvent({ action, payload, origin = "*" }) {
  await browser.execute(
    (message) => {
      window.postMessage({ action: message.action, payload: message.payload }, message.origin);
    },
    { action, payload, origin },
  );
}
