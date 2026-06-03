//
//  CounterView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct CounterView: View {
  let score: Int
  let backgroundColor: Color
  
  var body: some View {
    BaseCounterView(score: score,
                    backgroundColor: backgroundColor,
                    size: CGSize(width: 28.0,
                                 height: 28.0),
                    font: .SkyBet.Bold.large)
  }
}

struct SmallCounterView: View {
  let score: Int
  let backgroundColor: Color
  
  var body: some View {
    BaseCounterView(score: score,
                    backgroundColor: backgroundColor,
                    size: CGSize(width: 20.0,
                                 height: 20.0),
                    font: .SkyBet.Bold.small)
  }
}

private struct BaseCounterView: View {
  let score: Int
  let backgroundColor: Color
  let size: CGSize
  let font: Font
  
  var body: some View {
    RoundedRectangle(cornerRadius: 4)
      .fill(backgroundColor)
      .frame(width: size.width,
             height:size.height)
      .foregroundStyle(.white)
      .overlay {
        Text(score.description)
          .foregroundStyle(.white)
          .font(font)
      }
  }
}


#Preview {
  CounterView(score: 1, backgroundColor: .white)
}
