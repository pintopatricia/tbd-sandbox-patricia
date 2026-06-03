import { BetMutationEligibilityServiceApi, Configuration } from "../../clients/__generated__/bme/index";
import { getHttpClientsConfig } from "../client-factory";

const config = new Configuration({
  basePath: getHttpClientsConfig().ENDPOINTS?.BME?.slice(0, -1), // removing the trailing "/"
  credentials: "include",
});

export const bmeApi = new BetMutationEligibilityServiceApi(config);
