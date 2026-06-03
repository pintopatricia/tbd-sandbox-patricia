//
//  ScoresAttributes.swift
//  tbd_native
//

import ActivityKit
import Foundation
import SwiftUI
import WidgetKit

public struct ScoresAttributes: ActivityAttributes {
  public struct Team: Codable, Hashable {
    public var name: String
    public var crest: String? // understand the way we'll pass images to the LA
  }
  
  public struct Teams: Codable, Hashable {
    public var home: Team
    public var away: Team
  }
  
  public struct Score: Codable, Hashable {
    public var home: Int
    public var away: Int
  }
  
  public enum State: String, Codable, Hashable {
    case PRE_PLAY
    case FIRST_HALF
    case HALF_TIME
    case SECOND_HALF
    case FULL_TIME
    case EXTRA_TIME_PRE_PLAY
    case EXTRA_TIME_FIRST_HALF
    case EXTRA_TIME_HALF_TIME
    case EXTRA_TIME_SECOND_HALF
    case PENALTIES
    case END
  }
  
  public struct Clock: Codable, Hashable {
    public var minutes: Int
    public var seconds: Int
  }
  
  // Dynamic content
  public struct ContentState: Codable, Hashable {
    public var score: ScoresAttributes.Score?
    public var penalties: ScoresAttributes.Score?
    public var state: ScoresAttributes.State // should default to .PRE_PLAY
    public var clock: ScoresAttributes.Clock?
    public var actualTime: TimeInterval // timestamp
  }
  
  // Static content
  public var teams: ScoresAttributes.Teams
  public var eventId: String
  public var eventStartTime: Date
}
