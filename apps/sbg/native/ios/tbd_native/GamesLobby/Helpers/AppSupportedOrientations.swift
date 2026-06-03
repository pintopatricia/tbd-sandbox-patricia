import Foundation
import UIKit

@objc class AppSupportedOrientations: NSObject {
  @objc static let gamesOrientations: UIInterfaceOrientationMask = .allButUpsideDown
  @objc static var applicationDefaultOrientations: UIInterfaceOrientationMask {
    let supportedInterfaceOrientations: [String] = Settings.configValue(for: ConfigKeys.SupportedInterfaceOrientationsKey)
    let supportedInterfaceOrientations2: [UInt] = supportedInterfaceOrientations.map({
      switch $0 {
      case "UIInterfaceOrientationPortrait":
        return UIInterfaceOrientationMask.portrait.rawValue
      case "UIInterfaceOrientationPortraitUpsideDown":
        return UIInterfaceOrientationMask.portraitUpsideDown.rawValue
      case "UIInterfaceOrientationLandscapeLeft":
        return UIInterfaceOrientationMask.landscapeLeft.rawValue
      case "UIInterfaceOrientationLandscapeRight":
        return UIInterfaceOrientationMask.landscapeRight.rawValue
      default:
        return 0
      }
    })
    return UIInterfaceOrientationMask(rawValue: Set(supportedInterfaceOrientations2).reduce(0, +))
  }
}
