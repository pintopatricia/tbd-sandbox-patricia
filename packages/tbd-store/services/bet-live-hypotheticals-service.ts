import BetLiveHypotheticals from "../clients/blh/bet-live-hypotheticals-client";
import { createClientFactory } from "./client-factory";
import { BetsResultQuery, InputBet } from "../clients/blh/bet-live-hypotheticals-response-types";
import URN from "../state/layout/URN";

const betLiveHipotheticalsClientFactory = createClientFactory(BetLiveHypotheticals);
export type BetsResultServiceResponse = (BetsResultQuery["betsResult"][number] & { urn: URN })[];
type GetBetsResultParams = {
  bets: InputBet[];
  urnList: URN[];
};

export default {
  async getBetsResult({ bets, urnList }: GetBetsResultParams): Promise<BetsResultServiceResponse> {
    const betLiveHipotheticalsClient = betLiveHipotheticalsClientFactory("BLH");

    const { betsResult } = await betLiveHipotheticalsClient.getBetsResult({ bets });

    const result = betsResult.map((betResult, index) => ({
      ...betResult,
      urn: urnList[index],
    }));

    return result;
  },
};
