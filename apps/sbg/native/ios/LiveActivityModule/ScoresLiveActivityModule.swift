//
//  ScoresLiveActivityModule.swift
//  tbd_native
//
//  Created by Pedro Silva on 17/02/2026.
//

import Foundation
import ActivityKit

@objc(ScoresLiveActivityModule)
class ScoresLiveActivityModule: NSObject, RCTBridgeModule {
  private let dataStore: LiveActivityDataStore
  private var finishedPushTokens: [LiveActivityData]

  private lazy var decoder: JSONDecoder = {
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601
    return decoder
  }()

  private lazy var imageDownloader: ImageDownloader = {
    ImageDownloader(appGroup: ScoresLiveActivityConstants.appGroup)
  }()

  // MARK: Initialize

  override init() {
    let dataStore = LiveActivityDataStore()
    var finishedPushTokens: [LiveActivityData] = []

    if #available(iOS 16.1, *) {
      let currentLiveActivityIds = Activity<ScoresAttributes>.activities.map { $0.id }
      finishedPushTokens = dataStore.sync(withActivityIds: currentLiveActivityIds)
    }

    self.dataStore = dataStore
    self.finishedPushTokens = finishedPushTokens
  }

  func setupMonitoring() {
    if #available(iOS 16.1, *) {
      for activity in Activity<ScoresAttributes>.activities {
        monitorLiveActivity(activity, callback: {_ in })
      }
    }
  }

  // MARK: RN Module API

  static func moduleName() -> String {
    return "ScoresLiveActivityModule"
  }

  @objc(startScoresLiveActivity:payload:resolver:rejecter:)
  func startScoresLiveActivity(
    _ eventId: String,
    payload: [String: Any],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
      guard !dataStore.hasLiveActivity(for: eventId) else {
        print("🐼 Live activity already exists for eventId: \(eventId)")
        let error = LiveActivityError.activityExists(eventId: eventId)
        reject(error.code,
               error.message,
               error.nsError)
        return
      }

      let liveActivityPayload: SportsLiveActivityPayload
      do {
        liveActivityPayload = try payload.decode(SportsLiveActivityPayload.self, using: decoder)
      } catch let error {
        print("🐼 Failed to decode payload: \(error.localizedDescription)")
        let payloadError = LiveActivityError.payloadDecodeFailed(error: error)
        reject(payloadError.code,
               payloadError.message,
               payloadError.nsError)
        return
      }

      if #available(iOS 16.1, *) {
        Task {
          let attributes = await buildAttributes(with: liveActivityPayload)
          let contentState = await buildContentState(with: liveActivityPayload)

          do {
            let activity = try Activity<ScoresAttributes>.request(
              attributes: attributes,
              contentState: contentState,
              pushType: .token)

            monitorLiveActivity(activity, callback: { pushToken in
              resolve(["pushToken": pushToken])
            })

            dataStore.addItem(eventId: eventId,
                              activityId: activity.id)

            print("🐼 Started a Live Activity with ID: \(activity.id) for eventId: \(eventId)")
          } catch let error {
            print("🐼 Failed to create Live Activity: \(error.localizedDescription)")
            let activityError = LiveActivityError.createActivityFailed(error: error)
            reject(activityError.code, activityError.message, activityError.nsError)
          }
        }
      } else {
        print("🐼 Unsupported OS found, cannot start Live Activity")
        let error = LiveActivityError.unsupportedOSVersion
        reject(error.code, error.message, error.nsError)
      }
    }

  @objc(terminateScoresLiveActivity:callback:)
  func terminateScoresLiveActivity(_ eventId: String, callback: @escaping RCTResponseSenderBlock) {
    let removedItem = dataStore.removeByEventId(eventId)

    if #available(iOS 16.1, *) {
      Task {
        let activity = Activity<ScoresAttributes>.activities.first { activity in
          activity.id == removedItem?.activityId
        }

        guard let activity else {
          print("🐼 No Live Activity found to terminate for eventId: \(eventId)")
          callback(nil)
          return
        }

        await activity.end(dismissalPolicy: .immediate)
        print("🐼 Ended Live Activity with ID: \(activity.id) for eventId: \(eventId)")
      }
    }

    guard let removedItem, let removedPushToken = removedItem.pushToken else {
      callback(nil)
      return
    }
    callback([removedPushToken])
  }

  /// Asks the module if the given `eventId` has a valid LiveActivity ongoing
  /// - Parameters:
  ///   - eventId: a `String` that represents the eventId to search for
  ///   - callback: returns a `boolean` promise
  @objc(hasLiveActivity:callback:)
  func hasLiveActivity(_ eventId: String, callback: @escaping RCTResponseSenderBlock) {
    callback([dataStore.hasLiveActivity(for: eventId)])
  }

  /// Returns the `{ eventId, pushToken }` pairs for Live Activities that were cleaned
  /// up by the data-store sync at module init (i.e. activities that ended while the
  /// app was closed). The internal list is cleared after returning, so a second call
  /// returns an empty array.
  /// - Parameter callback: returns an array of `[String: String]` pairs
  @objc(getFinishedPushTokens:)
  func getFinishedPushTokens(_ callback: @escaping RCTResponseSenderBlock) {
    let tokens = finishedPushTokens.compactMap { item -> [String: String]? in
      guard let pushToken = item.pushToken else { return nil }
      return ["eventId": item.eventId, "pushToken": pushToken]
    }
    finishedPushTokens = []
    callback([tokens])
  }

  // MARK: Private helpers

  private func buildAttributes(with payload: SportsLiveActivityPayload) async -> ScoresAttributes {
    await downloadImage(payload.teams.home.crest)
    await downloadImage(payload.teams.away.crest)

    return ScoresAttributes(with: payload)
  }

  private func buildContentState(with payload: SportsLiveActivityPayload) async -> ScoresAttributes.ContentState {
    ScoresAttributes.ContentState(with: payload)
  }

  private func downloadImage(_ image: String?) async {
    if let image {
      let _ = try? await imageDownloader.storeImage(from: image,
                                                    filename: image.convertToFilename())
    }
  }

  @available(iOS 16.1, *)
  private func monitorLiveActivity(_ activity: Activity<ScoresAttributes>, callback: @escaping (String) -> Void) {
    Task {
      for await pushToken in activity.pushTokenUpdates {
        let tokenString = pushToken.reduce("") { $0 + String(format: "%02x", $1) }

        switch dataStore.updatePushToken(tokenString,
                                         forActivityId: activity.id) {
        case .notFound:
          print("No activity data found for activityId: \(activity.id)")
        case .unchanged(let item):
          print("Found activity with similar token. No update required")
        case .updated(let item):
          print("Updated token for activityId: \(activity.id): \(tokenString)")
          callback(tokenString)
          // TODO
          // -> If not release, publish token to logs/settings
          // -> Send token to server if there is a change (new token or updated token
        }
      }
    }
    Task {
      for await activityState in activity.activityStateUpdates {
        print("🐼 activity state: '\(activityState)' for activityId: \(activity.id)")
        switch activityState {
        case .ended, .dismissed:
          if let item = dataStore.item(activityId: activity.id) {
            let pushToken = item.pushToken
            terminateScoresLiveActivity(item.eventId) {_ in }
            if let pushToken {
              ScoresLiveActivityEventEmitter.send(
                ScoresLiveActivityEventEmitter.Events.onLiveActivityEnded,
                body: ["eventId": item.eventId, "pushToken": pushToken]
              )
            }
          }
        default:
          continue
        }
      }
    }
  }
}

// MARK: - Attributes extension

extension ScoresAttributes {
  init(with payload: SportsLiveActivityPayload) {
    teams = Teams(home: Team(name: payload.teams.home.name,
                             crest: payload.teams.home.crest?.convertToFilename()),
                  away: Team(name: payload.teams.away.name,
                             crest: payload.teams.away.crest?.convertToFilename()))

    eventId = payload.eventId

    let dateFormatter = ISO8601DateFormatter()
    dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    eventStartTime = dateFormatter.date(from: payload.startTime) ?? Date()
  }
}

extension ScoresAttributes.ContentState {
  init(with payload: SportsLiveActivityPayload) {
    state = ScoresAttributes.State(with: payload.matchStatus, period: payload.matchPeriod)
    actualTime = Date().timeIntervalSince1970

    if let score = payload.score {
      self.score = ScoresAttributes.Score(home: score.home,
                                          away: score.away)
    }

    if let penalties = payload.penaltyScore {
      self.penalties = ScoresAttributes.Score(home: penalties.home,
                                              away: penalties.away)
    }

    if let clock = payload.clock {
      self.clock = ScoresAttributes.Clock(minutes: clock.minutes,
                                          seconds: clock.seconds)
    }
  }
}

private extension ScoresAttributes.State {
  init(with status: MatchStatus, period: MatchPeriod) {
    switch (status, period) {
    case (.preMatch, _): self = .PRE_PLAY
    case (.inPlayFirstHalf, .regular): self = .FIRST_HALF
    case (.inPlayFirstHalf, .extra): self = .EXTRA_TIME_FIRST_HALF
    case (.inPlaySecondHalf, .regular): self = .SECOND_HALF
    case (.inPlaySecondHalf, .extra): self = .EXTRA_TIME_SECOND_HALF
    case (.halftime, .regular): self = .HALF_TIME
    case (.halftime, .extra): self = .EXTRA_TIME_HALF_TIME
    case (.fulltime, _): self = .FULL_TIME
    case (.penaltyShootout, _): self = .PENALTIES
    case (.end, _): self = .END
    }
  }
}
