//
//  ScoreboardCounterView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct ScoreboardCounterView: View {
  let homeScore: Int
  let awayScore: Int
  let backgroundColor: Color
  
  var body: some View {
    HStack(spacing: 2) {
      CounterView(
        score: homeScore,
        backgroundColor: backgroundColor
      )
      CounterView(
        score: awayScore,
        backgroundColor: backgroundColor
      )
    }
  }
}

#Preview {
  ScoreboardCounterView(homeScore: 0, awayScore: 0, backgroundColor: .blue)
}
