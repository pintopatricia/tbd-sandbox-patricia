import UIKit
import Foundation

@objc(GamesLobbyEventEmitter)
final class GamesLobbyEventEmitter: RCTEventEmitter, @unchecked Sendable {

  @GamesActor private static var shared: GamesLobbyEventEmitter?

  override init() {
    super.init()
    storeInstance(self)
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  override func supportedEvents() -> [String]! {
    return [
      "onSSOIDRequired",  // event sent to RN when an authorisationToken is required
      "onNeedsAppLogout",  // event sent to RN when a logout is requested
      "onOpenGameCollectionScreen",  // event sent to RN when navigation to GameCollection screen is requested
      "onOpenMySelectionsScreen",  // event sent to RN when navigation to MySelections screen is requested
      "onGoToHomeTabScreen",  // event sent to RN when HomeTab screen needs to be presented
      "onDismissMySelectionsScreen",  // event sent to RN when MySelections screen needs to be dismissed
      "onShowWebView", // event sent to RN when navigation to a footer url - open a React Native web view
      "onDismissGameContainer", // event sent to RN when a GameContainer is dismissed in order clean the gameLaunch context data
      "onOpenPreferenceCenter", // event sent to RN when Privacy Preference Center is pressed , to open it on RN side
      "onOpenGameDetailsScreen", // event sent to RN when opening Game Details Screen to  change back button with logo
      "onDismissGameDetailsScreen", // event sent to RN when closing Game Details Screen to change logo to back button if its needed
      "onOpenSubGameCollectionScreen", // event sent to RN when navigation to GameSubCollection screen is requested
      "onScrollHeaderThresholdReached", // event sent to RN when the scroll position crosses the header threshold (up or down)
    ]
  }
  
  /// Proxy class method to bridge event into concurrency safe actor `GamesActor`
  /// - Parameter name: The event name `String` to send
  public static func sendEvent(withName name: String, body: [String: Any]? = nil) {
    Task { @GamesActor in
      shared?.sendEvent(withName: name, body: body )
    }
  }
  
  /// Proxy private method to store self in static var using a concurrency safe `GamesActor`
  /// - Parameter shared: The `GamesLobbyEventEmitter` to store
  private func storeInstance(_ shared: GamesLobbyEventEmitter) {
    Task { @GamesActor in
      GamesLobbyEventEmitter.shared = shared
    }
  }
}
