import { SagaIterator } from "redux-saga";
import { call, spawn, select, take, put } from "redux-saga/effects";

import {
  URLBetslipDeeplinkAction,
  URL__BETSLIP_DEEPLINK,
  CommandsInitAction,
  COMMANDS__INIT,
} from "../actions/commands";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import { AppCommand, AppCommands, CMD_LOAD_SBK_BETSLIP, LoadSbkBetslipCommand, ModulesState } from "../state";
import { getModules } from "../state/modules/modules-selectors";

const AVAILABLE_COMMANDS: AppCommand["name"][] = [CMD_LOAD_SBK_BETSLIP];

function sanitizeCommands(inputCommands: AppCommands): AppCommands {
  return inputCommands.filter((cmd) => AVAILABLE_COMMANDS.includes(cmd.name));
}

function* waitForBettingModule(): SagaIterator {
  const modules: ModulesState = yield select(getModules);

  if (!modules.sbkBetting) {
    yield take(MODULES__SBK_BETTING_LOADED);
  }
}

function* bettingModuleLoadedCommands(commands: AppCommands): SagaIterator {
  yield call(waitForBettingModule);

  const loadSbkBetslipCommand = commands.find((cmd): cmd is LoadSbkBetslipCommand => cmd.name === CMD_LOAD_SBK_BETSLIP);
  if (loadSbkBetslipCommand) {
    yield put<URLBetslipDeeplinkAction>({
      type: URL__BETSLIP_DEEPLINK,
      payload: loadSbkBetslipCommand.args,
    });
  }
}

function* handleCommands(commands: AppCommands): SagaIterator {
  const sanitizedCommands = sanitizeCommands(commands);
  // handle commands that depends on betting module
  yield spawn(bettingModuleLoadedCommands, sanitizedCommands);
}

export function* commandsSaga(commands?: AppCommands): SagaIterator {
  if (commands) {
    yield call(handleCommands, commands);
  }

  // execute other commands here
  while (true) {
    const action: CommandsInitAction = yield take(COMMANDS__INIT);
    yield call(handleCommands, action.payload);
  }
}
