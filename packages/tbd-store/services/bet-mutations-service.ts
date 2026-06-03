import { SportsbookCashoutOperation } from "@flutter-global/uki-channels-http-clients";
import { FreezeBetResp } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookCashoutOperation/FixedOddsTransactional";

import { createClientFactory } from "./client-factory";

const sportsbookCashoutOperationFactory = createClientFactory(SportsbookCashoutOperation);

export default {
  async freezeBet(betId: string, legRefs: Array<string>): Promise<FreezeBetResp | undefined> {
    const sportsbookCashoutOperation = sportsbookCashoutOperationFactory("SCO");
    const response: FreezeBetResp = await sportsbookCashoutOperation.freezeBet(betId, legRefs);

    return response;
  },
};
