import { HostEventsWalletUpdatedEventPayload, PayloadObject, TheBridgeSBKApi } from "@flutter-global/the-bridge";
import { EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store";
import { FETCH_USER_WALLETS_SUCCESS, FetchUserWalletsSuccessAction } from "@ppb/tbd-store/actions/user-wallets";
import { getStore } from "@ppb/tbd-store/create-store";
import { WalletStatus } from "@ppb/tbd-store/state/constants";
import subscribeEvent from "../../event-broker/event-subscriber";
import emit from "../../event-broker/event-emitter";

const register = () => {
  const store = getStore();
  const bridge = TheBridgeSBKApi.getInstance();

  subscribeEvent("@@THE_BRIDGE/SBK_BET_PLACED", () => {
    try {
      bridge.emitBetPlacement();
    } catch (err) {
      const error = err as Error;
      const noticeError = window?.newrelic?.noticeError;
      if (noticeError) {
        noticeError(new Error(`TheBridge emitBetPlacement error: ${error.message}`));
      }
    }
  });

  subscribeEvent("@@THE_BRIDGE/SBK_BET_CASHED_OUT", () => {
    try {
      bridge.emitBetCashedOut();
    } catch (err) {
      const error = err as Error;
      const noticeError = window?.newrelic?.noticeError;

      if (noticeError) {
        noticeError(new Error(`TheBridge emitBetCashedOut error: ${error.message}`));
      }
    }
  });

  subscribeEvent("@@THE_BRIDGE/SBK_WEB_APP_READY", () => {
    try {
      bridge.emitWebAppReady();
    } catch (err) {
      const error = err as Error;
      const noticeError = window?.newrelic?.noticeError;

      if (noticeError) {
        noticeError(new Error(`TheBridge emitWebAppReady error: ${error.message}`));
      }
    }
  });

  subscribeEvent("@@THE_BRIDGE/HOST_WALLET_UPDATED", (payload: HostEventsWalletUpdatedEventPayload) => {
    const { amount, availabletobet, bonus, bonuses, deposits, real, winnings } = payload.details ?? {};

    if (payload.name && amount) {
      store.dispatch<FetchUserWalletsSuccessAction>({
        type: FETCH_USER_WALLETS_SUCCESS,
        payload: [
          {
            walletName: payload.name,
            status: WalletStatus.SUCCESS,
            // @ts-expect-error - The Wallet type defined in uki-channels-http-clients is not aligned to the structure WAS returns.
            amount,
            availabletobet,
            bonus,
            bonuses,
            deposits,
            real,
            winnings,
          },
        ],
      });
    }
  });

  subscribeEvent("@@THE_BRIDGE/HOST_PERSONAL_DETAILS_UPDATED", () => {
    window?.location?.reload();
  });

  subscribeEvent("@@THE_BRIDGE/HOST_NAVIGATE", (payload: PayloadObject) => {
    const { url: viewUrl } = payload;

    store.dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: { viewUrn: "", viewUrl },
    });
  });

  subscribeEvent("@@THE_BRIDGE/SBK_PRIVACY_CENTER_BUTTON_CLICKED", () => {
    try {
      bridge.emitPrivacyCenterButtonClicked();
    } catch (err) {
      const error = err as Error;
      const noticeError = window?.newrelic?.noticeError;

      if (noticeError) {
        noticeError(new Error(`TheBridge emitPrivacyCenterButtonClicked error: ${error.message}`));
      }
    }
  });

  emit("@@THE_BRIDGE/SBK_WEB_APP_READY", null);
};

export default register;
