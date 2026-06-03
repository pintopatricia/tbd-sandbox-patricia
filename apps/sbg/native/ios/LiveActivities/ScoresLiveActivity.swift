//
//  ScoresLiveActivity.swift
//  LiveActivities
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import WidgetKit
import SwiftUI

struct InPlayHomeScreen: View {
  let teams: LiveActivity.Teams
  let scoreboardType: LiveActivity.ScoreboardType

  var body: some View {
    VStack(spacing: 0) {
      TopBarView()
      MainView(
        teams: teams,
        scoreboardType: scoreboardType
      )
    }
  }
}

struct ScoresLiveActivity: Widget {
  let kind: String = "ScoresLiveActivity"

  var body: some WidgetConfiguration {
    ActivityConfiguration(for: ScoresAttributes.self) { context in
      let teams = InPlayHomeScreenViewModel.buildTeams(
        scoresAttributes: context.attributes
      )
      let scoreboardType = InPlayHomeScreenViewModel.buildScoreboard(
        scoresAttributes: context.attributes,
        content: context.state
      )
      InPlayHomeScreen(
        teams: teams,
        scoreboardType: scoreboardType
      ).widgetURL(URL(string: "https://www.skybet.com/betting/view/e-\(context.attributes.eventId)"))

    } dynamicIsland: { context in
      let teams = InPlayHomeScreenViewModel.buildTeams(
        scoresAttributes: context.attributes
      )
      let scoreboardType = InPlayHomeScreenViewModel.buildScoreboard(
        scoresAttributes: context.attributes,
        content: context.state
      )
      return DynamicIsland {
        DynamicIslandExpandedRegion(.center) {
          HStack {
            TeamCrestNameView(
              team: teams.home.name,
              crest: teams.home.crest
            )
            ScoreboardView(scoreboardType: scoreboardType)
            TeamCrestNameView(
              team: teams.away.name,
              crest: teams.away.crest
            )
          }
        }
      } compactLeading: {
        VStack(alignment: .trailing) {
          HStack(spacing: 4.0) {
            CrestView(crest: teams.home.crest)
            SmallCounterView(
              score: context.state.score?.home ?? 0,
              backgroundColor: LiveActivity.LiveActivityType(
                state: context.state.state,
                startingTime: context.attributes.eventStartTime
              ).color
            )
          }
          .padding(.leading, 0.0)
        }
        .padding(.leading, 10.0)
      } compactTrailing: {
        VStack(alignment: .leading) {
          HStack(spacing: 4.0) {
            SmallCounterView(
              score: context.state.score?.away ?? 0,
              backgroundColor: LiveActivity.LiveActivityType(
                state: context.state.state,
                startingTime: context.attributes.eventStartTime
              ).color
            )
            CrestView(crest: teams.away.crest)
          }
          .padding(.trailing, 0.0)
        }
        .padding(.trailing, 10.0)
      } minimal: {

      }
      .widgetURL(URL(string: "https://www.skybet.com/betting/view/e-\(context.attributes.eventId)"))
      .keylineTint(Color.red)
    }
  }
}
