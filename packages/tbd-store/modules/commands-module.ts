import { ISagaModule } from "redux-dynamic-modules-saga";

import { commandsMiddleware } from "../middlewares/commands";
import { commandsSaga } from "../middlewares/commands-saga";
import { AppCommands, ApplicationState } from "../state";

export const getCommandsModule = (commands?: AppCommands): ISagaModule<ApplicationState> => ({
  id: "commands-module",
  reducerMap: {} as any,
  middlewares: [commandsMiddleware],
  sagas: [() => commandsSaga(commands)],
});
