import { AppContextDetails, EnvironmentConfig, BootState, UserDetails, UserState } from "../../state";
import { AppContextQuery } from "../catalogue/catalogue-response-types";

type OnlineUserDetails = { [K in keyof Pick<UserState, "userdetails">]: UserDetails };

type InitialState = {
  entities: Pick<
    UserState,
    "productId" | "appversion" | "preferences" | "brandSettings" | "throttles" | "experiments"
  > &
    OnlineUserDetails;
  boot?: BootState;
};

export type AppContextData = {
  initialState: InitialState;
  environment: EnvironmentConfig;
  queryResponse: AppContextQuery;
};

export type TerritoryBlockingData = {
  details: AppContextDetails;
};

export type AppContextResponse = AppContextData | TerritoryBlockingData;

export class AuthError extends Error {
  name = "AuthError";
}
