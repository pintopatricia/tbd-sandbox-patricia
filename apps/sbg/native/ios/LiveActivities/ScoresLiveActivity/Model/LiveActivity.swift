//
//  LiveActivity.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct LiveActivity {
  enum ScoreboardType {
    case text(
      value: String
    )
    case clock(
      value: String,
      homeScore: Int,
      awayScore: Int,
      homePenaltiesScore: Int?,
      awayPenaltiesScore: Int?,
      backgroundColor: Color
    )
    case tickingClock(
      timer: Date,
      homeScore: Int,
      awayScore: Int,
      homePenaltiesScore: Int?,
      awayPenaltiesScore: Int?,
      backgroundColor: Color
    )
  }
  
  struct Teams {
    let home: LiveActivity.Team
    let away: LiveActivity.Team
  }
  
  struct Team {
    let name: String
    let crest: String?
  }
  
  struct Timer {
    let actualTime: Date
    
    init(
      state: ScoresAttributes.ContentState
    ) {
      
      let storedSeconds = (state.clock?.minutes ?? 0) * 60 + (state.clock?.seconds ?? 0)
      
      actualTime = Date(timeIntervalSince1970: state.actualTime)
        .addingTimeInterval(-TimeInterval(storedSeconds))
    }
  }
  
  enum LiveActivityType {
    case prePlay(date: Date)
    case firstHalf
    case halfTime
    case secondHalf
    case fullTime
    case extraTimePrePlay
    case extraTimeFirstHalf
    case extraTimeHalfTime
    case extraTimeSecondHalf
    case penalties
    case end
    
    var color: Color {
      switch self {
      case .fullTime:
        Color.graySky
      default:
        Color.blueSky
      }
    }
    
    var description: String {
      switch self {
      case .prePlay(let date):
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .none
        formatter.dateFormat = "HH:mm"
        return "Today, \(formatter.string(from: date))"
        
      case .halfTime:
        return "HT"
      case .fullTime, .end:
        return "FT"
      case .extraTimeHalfTime:
        return "ET HT"
      case .penalties:
        return "PEN"
      default:
        return ""
      }
    }
    
    init(state: ScoresAttributes.State,
         startingTime: Date) {
      switch state {
      case .PRE_PLAY:
        self = .prePlay(date: startingTime)
      case .FIRST_HALF:
        self = .firstHalf
      case .HALF_TIME:
        self = .halfTime
      case .SECOND_HALF:
        self = .secondHalf
      case .FULL_TIME:
        self = .fullTime
      case .EXTRA_TIME_FIRST_HALF:
        self = .extraTimeFirstHalf
      case .EXTRA_TIME_HALF_TIME:
        self = .extraTimeHalfTime
      case .EXTRA_TIME_SECOND_HALF:
        self = .extraTimeSecondHalf
      case .PENALTIES:
        self = .penalties
      case .EXTRA_TIME_PRE_PLAY:
        self = .extraTimePrePlay
      case .END:
        self = .end
      }
    }
  }
}
