import { MessageCode, MessageType } from "../../constants";

export type Message = {
  code: MessageCode;
  type?: MessageType;
  title: string;
  description?: string;
  icon?: string;
  iconCentered?: boolean;
};

export type Messages = {
  [code: number]: Message;
  messagesByTypeOrder: Set<MessageCode>;
};

export { MessageCode, MessageType } from "../../constants";
