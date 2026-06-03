//
//  TeamCrestNameView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct TeamCrestNameView: View {
  let team: String
  let crest: String?
  
  var body: some View {
    VStack(spacing: 2) {
      CrestView(crest: crest)
      Text(team)
        .multilineTextAlignment(.center)
        .foregroundStyle(.white)
        .font(.SkyBet.Bold.medium)
        .bold()
        .lineLimit(2)
        .fixedSize(horizontal: false, vertical: true)
      Spacer()
    }
    .frame(maxWidth: .infinity, minHeight: 54, maxHeight: .infinity)
    
  }
}

#Preview {
  TeamCrestNameView(team: "Avintes", crest: "Avintes")
}
