//
//  SportsLiveActivityPayload.swift
//  tbd_native
//

struct SportsLiveActivityPayload: Codable {
  let eventId: String
  let startTime: String
  let matchStatus: MatchStatus
  let matchPeriod: MatchPeriod
  let teams: Teams
  let score: Score?
  let penaltyScore: Score?
  let clock: Clock?
}

struct Teams: Codable {
  let home: Team
  let away: Team
}

struct Team: Codable {
  let name: String
  let crest: String?
}

struct Score: Codable {
  let home: Int
  let away: Int
}

enum MatchStatus: String, Codable {
  case preMatch = "PRE_MATCH"
  case halftime = "HALF"
  case fulltime = "FULL"
  case inPlayFirstHalf = "INPLAY_FIRST_HALF"
  case inPlaySecondHalf = "INPLAY_SECOND_HALF"
  case penaltyShootout = "PENALTY_SHOOTOUT"
  case end = "END"
}

enum MatchPeriod: String, Codable {
  case regular = "REGULAR"
  case extra = "EXTRA"
}

struct Clock: Codable {
  let minutes: Int
  let seconds: Int
}

// MARK: - Extensions

extension Team {
  var crestFilename: String? {
    guard let crest else { return nil }
    return crest.convertToFilename()
  }
}
