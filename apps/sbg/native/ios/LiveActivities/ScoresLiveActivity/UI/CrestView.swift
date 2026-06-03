//
//  CrestView.swift
//  tbd_native
//
//  Created by Ivo Teixeira on 18/03/2026.
//

import SwiftUI

struct CrestView: View {
  let crest: String?
  
  var body: some View {
    if let image = loadImage {
      Image(uiImage: image)
        .resizable()
        .aspectRatio(contentMode: .fit)
        .frame(
          width: 25,
          height: 30
        )
    } else {
      Image(ScoresLiveActivityConstants.defaultCrest)
        .resizable()
        .aspectRatio(contentMode: .fit)
        .frame(
          width: 25,
          height: 30
        )
    }
  }
  
  private var loadImage: UIImage?  {
    guard let crest = crest else { return nil }
    
    return ImageDownloader(appGroup: ScoresLiveActivityConstants.appGroup).loadImage(named: crest)
  }
}

#Preview {
  CrestView(crest: nil)
}

