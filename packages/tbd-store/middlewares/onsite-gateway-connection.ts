import { Connection, ConnectionConfig, TopicMessage } from "@ppb/onsite-gateway-client";

import { getHttpClientsConfig } from "../services/client-factory";
import { getApplicationKey } from "../config/application-key";
import { TopicPayloadMap } from "@ppb/onsite-gateway-client/dist/types";

let connection: Connection | null = null;

type OnWebsocketMessage<K extends keyof TopicPayloadMap> = (message: TopicPayloadMap[K]) => void;

export function ensureConnection(): Connection {
  if (connection) return connection;

  const endpoint = getHttpClientsConfig().ENDPOINTS?.OSG;

  if (!endpoint) {
    throw new Error("OSG endpoint missing");
  }

  const config: ConnectionConfig = {
    endpoint: new URL(`${endpoint}?_ak=${getApplicationKey()}`),
  };

  connection = Connection.connect(config);

  return connection;
}

export const getConnection = (): Connection | null => connection;

export const appVisibilityChangeCallback = (visible: boolean): void => {
  if (connection && ["OPEN", "CLOSED"].includes(connection.getStatus())) {
    connection.onVisibilityChange(visible);
  }
};

export const acknowledgeMessageCallback = (message: TopicMessage): void => {
  if (connection && connection.getStatus() === "OPEN" && message.ackRequired) {
    connection.acknowledge(message);
  }
};

export const subscribeToTopic = <K extends keyof TopicPayloadMap>(
  topic: K,
  onMessage: OnWebsocketMessage<typeof topic>,
): Promise<string> =>
  connection?.subscribe(topic, onMessage) || Promise.reject(new Error("OSG connection not initialized"));

export const unsubscribeFromTopic = <K extends keyof TopicPayloadMap>(
  topic: K,
  onMessage: OnWebsocketMessage<typeof topic>,
): Promise<string> =>
  connection?.unsubscribe(topic, onMessage) || Promise.reject(new Error("OSG connection not initialized"));
