//
//  TopBarView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI
import WidgetKit

struct TopBarView: View {
  var body: some View {
    ZStack(alignment: .center) {
      Color.blueSky
      Image("SkyBet")
        .resizable()
        .aspectRatio(contentMode: .fit)
      
      
    }
    .padding(.vertical, 8)
    .frame(height: 34)
    .background(Color.blueSky)
  }
}

#Preview {
  TopBarView()
}
