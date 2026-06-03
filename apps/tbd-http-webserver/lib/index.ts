import { validator } from "fabric-input";
import getResponse from "./controller";

process.on("SIGINT", () => {
  process.exit();
});

export const fn = getResponse;
export const route = "/";
export const verb = "GET";
export const mime = "text/html";
export const schema = {
  requestHost: validator.joi.string().example("https://www.betfair.com").description("original request host"),
};
