import { getEventRegistry } from "eventemitter3-singleton";
import type { Events } from "./events";

const { emit } = getEventRegistry<Events>();

export default emit;
