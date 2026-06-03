export enum ErrorType {
  FATAL_ERROR = "FATAL_ERROR",
  FATAL_EMPTY_VIEW_ERROR = "FATAL_EMPTY_VIEW_ERROR",
  FAILED_REQUEST = "FAILED_REQUEST",
}

// See Cougar 5.1.4 Fault reporting
// https://flutteruki.atlassian.net/wiki/spaces/FRAM/pages/95838757/Cougar+5.1.4+-+Fault+Reporting
export enum CougarFaultCode {
  Client = "Client",
  Server = "Server",
}

// See Cougar 5.1.4 Fault reporting
// https://flutteruki.atlassian.net/wiki/spaces/FRAM/pages/95838757/Cougar+5.1.4+-+Fault+Reporting
export enum CougarFaultString {
  SecurityException = "DSC-0015",
  UnrecognisedCredentials = "DSC-0035",
  InvalidCredentials = "DSC-0036",
}
