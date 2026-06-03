//
//  ScoreboardView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct ScoreboardView: View {
  let scoreboardType: LiveActivity.ScoreboardType
  
  var body: some View {
    VStack(alignment: .center, spacing: 8) {
      switch scoreboardType {
      case .text(let value):
        Text(value)
          .foregroundStyle(.white)
          .font(.SkyBet.Bold.small)
          .frame(alignment: .center)
          .multilineTextAlignment(.center)
      case .tickingClock(let date,
                         let homeScore,
                         let awayScore,
                         let homePenaltiesScore,
                         let awayPenaltiesScore,
                         let backgroundColor):
        VStack(alignment: .center, spacing: 8) {
          TickingClockView(date: date)
          ScoreboardCounterView(
            homeScore: homeScore,
            awayScore: awayScore,
            backgroundColor: backgroundColor)
          if let homePenaltiesScore = homePenaltiesScore,
             let awayPenaltiesScore = awayPenaltiesScore {
            PenaltiesView(
              homePenaltyScore: homePenaltiesScore,
              awayPenaltyScore: awayPenaltiesScore
            )
          }
        }
        
      case .clock(let value,
                  let homeScore,
                  let awayScore,
                  let homePenaltiesScore,
                  let awayPenaltiesScore,
                  let backgroundColor):
        VStack(alignment: .center, spacing: 8) {
          ClockView(value: value)
          ScoreboardCounterView(
            homeScore: homeScore,
            awayScore: awayScore,
            backgroundColor: backgroundColor)
          if let homePenaltiesScore = homePenaltiesScore,
             let awayPenaltiesScore = awayPenaltiesScore {
            PenaltiesView(
              homePenaltyScore: homePenaltiesScore,
              awayPenaltyScore: awayPenaltiesScore
            )
          }
        }
      }
    }
    .frame(maxWidth: .infinity, alignment: .center)
  }
  
  struct ClockView: View {
    let value: String
    
    var body: some View {
      Text(value)
        .foregroundStyle(.white)
        .font(.SkyBet.Bold.small)
        .frame(alignment: .center)
        .multilineTextAlignment(.center)
    }
  }
  
  struct TickingClockView: View {
    let date: Date
    
    var body: some View {
      Text(timerInterval: date.clockRange,
           pauseTime: nil,
           countsDown: false,
           showsHours: false)
      .multilineTextAlignment(.center)
      .font(.SkyBet.Bold.small)
      .foregroundStyle(.white)
      .monospacedDigit()
      .frame(maxWidth: .infinity, alignment: .center)
    }
  }
  
  struct PenaltiesView: View {
    let homePenaltyScore: Int
    let awayPenaltyScore: Int
    
    var body: some View {
      Text("\(homePenaltyScore)-\(awayPenaltyScore)")
        .foregroundStyle(.white)
        .font(.SkyBet.Bold.small)
    }
  }
}

private extension Date {
  /// Creates a range of dates from self to self + 3 hours
  /// This will allow the timmer to correctly be displayed and trucate the timer in case of lack of updates
  var clockRange: ClosedRange<Date> {
    return self...self.addingTimeInterval(3 * 60 * 60)
  }
}

#Preview {
  ScoreboardView(
    scoreboardType: .clock(
      value: "HT",
      homeScore: 3,
      awayScore: 5,
      homePenaltiesScore: 3,
      awayPenaltiesScore: 5,
      backgroundColor: .gray
    )
  )
}
