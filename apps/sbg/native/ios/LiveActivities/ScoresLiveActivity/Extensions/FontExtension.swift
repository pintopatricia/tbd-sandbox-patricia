//
//  FontExtension.swift
//  tbd_native
//

import SwiftUI

extension Font {
  enum SkyBet {
    enum Regular {
      static let small: Font = .buildFont(12, weight: .regular)
      static let medium: Font = .buildFont(14, weight: .regular)
      static let large: Font = .buildFont(16, weight: .regular)
    }
    
    enum Bold {
      static let small: Font = .buildFont(12, weight: .bold)
      static let medium: Font = .buildFont(14, weight: .bold)
      static let large: Font = .buildFont(16, weight: .bold)
    }
  }
  
  // MARK: Private helpers
  
  private enum SkyBetFontWeight: String {
    case regular = "Regular"
    case bold = "Medium"
  }
  
  private static func buildFont(_ size: CGFloat, weight: SkyBetFontWeight) -> Font {
    .custom("SkyText-\(weight.rawValue)", size: size)
  }
}
