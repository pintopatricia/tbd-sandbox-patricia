import Banners from "../../clients/max/Max";
import { createClientFactory } from "../client-factory";

const bannersClientFactory = createClientFactory(Banners);

export default {
  async handleBannerAction(data: string, actionType: string): Promise<Response> {
    const bannersClient = bannersClientFactory("HANDLE_BANNER_ACTION");
    const result = await bannersClient.handleBannerAction(data, actionType);

    if (!result.ok) {
      throw new Error("could not handle the action");
    }

    return result;
  },
};
