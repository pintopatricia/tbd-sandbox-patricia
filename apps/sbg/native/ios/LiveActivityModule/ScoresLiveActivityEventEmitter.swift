//
//  ScoresLiveActivityEventEmitter.swift
//  tbd_native
//

import Foundation

@objc(ScoresLiveActivityEventEmitter)
final class ScoresLiveActivityEventEmitter: RCTEventEmitter {
  private static weak var shared: ScoresLiveActivityEventEmitter?

  override init() {
    super.init()
    Self.shared = self
  }

  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func supportedEvents() -> [String]! {
    return [Events.onLiveActivityEnded]
  }

  static func send(_ name: String, body: [String: Any]? = nil) {
    shared?.sendEvent(withName: name, body: body)
  }

  enum Events {
    static let onLiveActivityEnded = "onLiveActivityEnded"
  }
}
