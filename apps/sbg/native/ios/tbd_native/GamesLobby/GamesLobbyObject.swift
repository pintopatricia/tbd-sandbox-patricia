import UIKit
import Foundation
import GamesFramework
@objc(GamesLobbyObject)

@MainActor
class GamesLobbyObject: NSObject {
  let gamesLobby = GamesLobbyView()
  
  @objc func triggerConfirmationPopUp(_ value : Bool) {
    gamesLobby.triggerConfirmation = value
  }
  
  @objc func gamesLobbyTabActive(_ value : Bool) {
    gamesLobby.gamesLobbyTabActive = value
  }

  @objc func closeGameInfoScreen(_ value : Bool) {
    gamesLobby.closeGameInfo = value
  }
  
  @objc func closeModalView(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    gamesLobby.closeModalView(resolver: resolver)
  }
  @objc func stopFTPSound(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    gamesLobby.stopFTPSound(resolver, rejecter: rejecter)
  }
}
