//
//  InPlayHomeScreenViewModel.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct InPlayHomeScreenViewModel {
  let teams: LiveActivity.Teams
  let scoreboardtype: LiveActivity.ScoreboardType
  
  static func buildTeams(
    scoresAttributes: ScoresAttributes
  ) -> LiveActivity.Teams {
    LiveActivity.Teams(
      home: LiveActivity.Team(name: scoresAttributes.teams.home.name,
                              crest: scoresAttributes.teams.home.crest),
      away: LiveActivity.Team(name: scoresAttributes.teams.away.name,
                              crest: scoresAttributes.teams.away.crest)
    )
  }
  
  static func buildScoreboard(
    scoresAttributes: ScoresAttributes,
    content: ScoresAttributes.ContentState
  ) -> LiveActivity.ScoreboardType {
    
    let value = LiveActivity.LiveActivityType(
      state: content.state,
      startingTime: scoresAttributes.eventStartTime
    ).description
    
    switch content.state {
      
    case .PRE_PLAY:
      return LiveActivity.ScoreboardType.text(value: value)
      
    case .FIRST_HALF, .SECOND_HALF, .EXTRA_TIME_FIRST_HALF, .EXTRA_TIME_SECOND_HALF:
      return LiveActivity.ScoreboardType.tickingClock(
        timer: LiveActivity.Timer(state: content).actualTime,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.blueSky)
      
    case .HALF_TIME:
      return LiveActivity.ScoreboardType.clock(
        value: value,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.blueSky)
      
    case .FULL_TIME, .END:
      return LiveActivity.ScoreboardType.clock(
        value: value,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.graySky)
      
    case .EXTRA_TIME_PRE_PLAY:
      return LiveActivity.ScoreboardType.clock(
        value: value,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.blueSky)
      
    case .EXTRA_TIME_HALF_TIME:
      return LiveActivity.ScoreboardType.clock(
        value: value,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.blueSky)
      
    case .PENALTIES:
      return LiveActivity.ScoreboardType.clock(
        value: value,
        homeScore: content.score?.home ?? 0,
        awayScore: content.score?.away ?? 0,
        homePenaltiesScore: content.penalties?.home,
        awayPenaltiesScore: content.penalties?.away,
        backgroundColor: Color.blueSky)
    }
  }
}
