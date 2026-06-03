import { getHttpClientsConfig } from "./client-factory";

export default {
  keepAlive(): void {
    const keepAliveEndpoint = getHttpClientsConfig().ENDPOINTS.KEEP_ALIVE;

    if (!keepAliveEndpoint) {
      return;
    }

    // Request as a pixel tracker
    document.createElement("img").src = keepAliveEndpoint;
  },
};
