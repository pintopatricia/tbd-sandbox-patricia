import Foundation
import GamesFramework
import Firebase

public enum RemoteLogErrorType: String, CaseIterable, Sendable {
  case reverseGeocodingFail                   = "Reverse Geocoding Failed"
  case reverseGeocodingLocationFail           = "Reverse Geocoding Location Failed"
  case configurationServiceData               = "ConfigurationService: No Data"
  case configurationServicePlist              = "ConfigurationService: Plist Invalid"
  case configurationServiceConfig             = "ConfigurationService: Cannot Parse Config"
  case keepAliveService                       = "Identitysso keepAlive Failed"
  case lobbyBaseAPIError                      = "GamesFramework: lobby baseAPI error"
  case lobbyBaseAPIBadResponseError           = "GamesFramework: lobby baseAPI bad response error"
  case lobbyBaseAPIDecodeError                = "GamesFramework: lobby baseAPI decode error"
  case lobbyBaseAPIRequestError               = "GamesFramework: lobby baseAPI request error"
  case CETFrameworkInitialization             = "CET Framework: failed to initialize"
  case launcherODRRequestError                = "LauncherODRManager: NSBundleResourceRequest failed"
  case launcherODRDownloadError               = "LauncherODRManager: handleDownloadingError"
  case gamesFrameworkGenericError             = "GamesFramework: Generic Error"

  static func matchLogType(_ string: String) -> RemoteLogErrorType? {
    return self.allCases.first{ "\($0)" == string }
  }
}

class RemoteLogs: NSObject {

  static let shared = RemoteLogs()

  /**
  Creates a JSON object
  - errorType: The type(category) of the error
  - description: A label to append to the error type to help distinguish between errors inside an error type  ex: "(errorType) - (extraLabel)"
  - message: A message with extra information
  */
  public static func log(errorType: RemoteLogErrorType, description: String? = nil, message: String? = nil, errorCode: Int? = nil) {
    Task {
      privateLog(errorType: errorType, 
                 description: description,
                 message: message,
                 appStatus: await appStatus(),
                 errorCode: errorCode)
    }
  }


  private static func privateLog(errorType: RemoteLogErrorType, description: String?, message: String?, appStatus: String, errorCode: Int?) {

    var domain = errorType.rawValue

    if let description = description {
      domain = "\(domain) - \(description)"
    }

    var userInfo: [String: String]?

    var messageInfo = "\(appStatus)"

    if let message = message {
      messageInfo.append(" - \(message)")
    }

    userInfo = [
      "message": messageInfo
    ]

    let error: NSError = NSError(domain: domain, code: errorCode ?? 0, userInfo: userInfo)
    Crashlytics.crashlytics().record(error: error)
  }

  @MainActor
  private static func appStatus() -> String {
    switch UIApplication.shared.applicationState {
    case .active, .inactive:
      return "foreground"
    case .background:
      return "background"
    @unknown default:
      return "unknown state"
    }
  }
}

extension RemoteLogs: LobbyFirebaseLoggingDelegate {
  func triggerCrashlyticsLogging(errorType: String?, details: String?, message: String?, errorCode: Int?) {

    let type = RemoteLogErrorType.matchLogType(errorType ?? "") ?? .gamesFrameworkGenericError;
    RemoteLogs.log(errorType: type, description: details, message: message, errorCode: errorCode)
  }
}
