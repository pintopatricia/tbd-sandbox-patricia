//
//  MainView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct MainView: View {
  let teams: LiveActivity.Teams
  let scoreboardType: LiveActivity.ScoreboardType
  
  var body: some View {
    HStack {
      HStack {
        TeamCrestNameView(
          team: teams.home.name,
          crest: teams.home.crest
        )
        
        ScoreboardView(
          scoreboardType: scoreboardType
        )
        
        TeamCrestNameView(
          team: teams.away.name,
          crest: teams.away.crest
        )
      }
      .fixedSize(horizontal: false, vertical: true)
      .frame(maxWidth: .infinity, minHeight: 54, maxHeight: .infinity)
      .padding(.vertical, 18)
      .padding(.horizontal, 20)
    }
    .background(
      ZStack(alignment: .top) {
        Color.blueBackground
        Image("Vector")
          .resizable()
          .aspectRatio(contentMode: .fit)
        
      }
    )
  }
}

#Preview {
  MainView(
    teams: LiveActivity.Teams(
      home: LiveActivity.Team(
        name: "Avintes",
        crest: nil
      ),
      away: LiveActivity.Team(
        name: "Avintes",
        crest: nil
      )
    ),
    scoreboardType: .text(value: "FT")
  )
}

