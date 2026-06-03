import { HttpResponseError } from "@flutter-global/uki-channels-http-clients";
import { CougarFaultCode, CougarFaultString } from "../state/network-status/Errors";

const COUGAR_FAULT_CODE_REGEX = /FaultCode=(.*),/;
const COUGAR_FAULT_STRING_REGEX = /FaultString=(.*)/;
const HTTP_STATUS_CODE_REGEX = /StatusCode=(\d+)/;

const UNAUTHORIZED_FAULT_STRINGS = [
  CougarFaultString.SecurityException,
  CougarFaultString.InvalidCredentials,
  CougarFaultString.UnrecognisedCredentials,
];

const parseErrorMessage = (message: string, errorRegex: RegExp): null | string => {
  const match = message.match(errorRegex);
  if (!match) {
    return null;
  }

  const [, matchedString] = match;
  return matchedString;
};

const parseHttpStatusCode = (error: Error): null | string => parseErrorMessage(error.message, HTTP_STATUS_CODE_REGEX);

const parseCougarFaultCode = (error: Error): null | string => parseErrorMessage(error.message, COUGAR_FAULT_CODE_REGEX);

const parseCougarFaultString = (error: Error): null | string =>
  parseErrorMessage(error.message, COUGAR_FAULT_STRING_REGEX);

export const isHttpUnauthorizedError = (error: Error): boolean => parseHttpStatusCode(error) === "401";

export const isHttpForbiddenError = (error: Error): boolean => parseHttpStatusCode(error) === "403";

export const isCougarUnauthorizedError = (error: Error): boolean => {
  const faultCode = parseCougarFaultCode(error);
  const faultString = parseCougarFaultString(error);

  if (!faultCode || !faultString) {
    return false;
  }

  const isCougarClientError = faultCode === CougarFaultCode.Client;
  const isCougarUnauthorized = UNAUTHORIZED_FAULT_STRINGS.some((str) => faultString === str);

  return isCougarClientError && isCougarUnauthorized;
};

export type HttpResponseErrorType = Error & {
  status: number;
};

export function isHttpResponseError(error: Error): error is HttpResponseErrorType {
  return (
    (error instanceof HttpResponseError && "status" in error && typeof error.status === "number") ||
    error.name === HttpResponseError.name
  );
}
