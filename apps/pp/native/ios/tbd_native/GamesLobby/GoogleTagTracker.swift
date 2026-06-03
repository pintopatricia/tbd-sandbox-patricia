import Foundation
import UIKit
import Firebase
import FirebaseAnalytics
import GamesFramework

class GoogleTagTracker: @unchecked Sendable {
  private struct GTMEvent {
    let name : String
    let parameters : [String: Any]
  }
  
  static let sharedInstance = GoogleTagTracker()
  
  var userConsent: UserConsentState = .unknown
  private var eventsArray : [GTMEvent] = []
  
  func triggerQueuedEvents() {
    for event in eventsArray {
      Analytics.logEvent(event.name, parameters: event.parameters)
    }
    eventsArray.removeAll()
  }
  
  private func getEventName(from parameters: [String: Any]) -> String {
    parameters[GATrackingConstants.EventParameterKey.event] as? String ?? GATrackingConstants.EventParameterValue.event
  }
  
  func triggerEventWithParams(_ eventName: String, parameters: [String: Any]) {
    switch GoogleTagTracker.sharedInstance.userConsent {
      case .unknown:
        eventsArray.append(GTMEvent(name: eventName, parameters: parameters))
      case .accepted:
        triggerQueuedEvents()
        Analytics.logEvent(eventName, parameters: parameters)
      case .denied:
        eventsArray.removeAll()
    }
  }
}

// MARK: GATrackingEventsDelegate
extension GoogleTagTracker: GATrackingEventsDelegate {
  func didReceiveGA(with parameters: [String : Any]) {
    let parametersGroup = ParametersGroup(parameters)
    
    Task { @MainActor in
      var orientation = ""
      if let interfaceOrientation = UIApplication.shared.windows.first(where: { $0.isKeyWindow })?.windowScene?.interfaceOrientation {
        if interfaceOrientation.isPortrait {
          orientation = "portrait"
        } else {
          orientation = "landscape"
        }
      }
      
      parametersGroup[GATrackingConstants.EventParameterKey.orientation] = orientation
      triggerEventWithParams(getEventName(from: parametersGroup.parameters),
                             parameters: parametersGroup.parameters)
    }
  }
  
  func didTrackScreen(screenName: String) {
    triggerEventWithParams(AnalyticsEventScreenView, parameters: [AnalyticsParameterScreenName: screenName])
  }
}
