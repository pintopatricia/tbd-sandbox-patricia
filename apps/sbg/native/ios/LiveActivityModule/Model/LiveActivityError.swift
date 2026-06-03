//
//  LiveActivityError.swift
//  tbd_native
//

enum LiveActivityError: Error {
  case activityExists(eventId: String)
  case payloadDecodeFailed(error: Error)
  case createActivityFailed(error: Error)
  case unsupportedOSVersion
  
  var code: String {
    switch self {
    case .activityExists: return "ACTIVITY_EXISTS"
    case .payloadDecodeFailed: return "PAYLOAD_DECODE_FAILED"
    case .createActivityFailed: return "CREATE_ACTIVITY_FAILED"
    case .unsupportedOSVersion: return "UNSUPPORTED_OS_VERSION"
    }
  }
  
  var message: String {
    switch self {
    case .activityExists(let eventId): return "Activity already exists for eventId: \(eventId)"
    case .payloadDecodeFailed(let error): return "Failed to decode payload: \(error.localizedDescription)"
    case .createActivityFailed(let error): return "Failed to create activity: \(error.localizedDescription)"
    case .unsupportedOSVersion: return "Unsupported OS version"
    }
  }
  
  var nsError: NSError {
    NSError(domain: code,
            code: -1,
            userInfo: [NSLocalizedDescriptionKey: message])
  }
}
