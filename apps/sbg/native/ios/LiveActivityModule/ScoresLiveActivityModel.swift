//
//  ScoresLiveActivityModel.swift
//  tbd_native
//
//  Created by Pedro Silva on 17/02/2026.
//


struct ScoresLiveActivityModel {
  struct Team {
    let name: String
    let crestURL: URL?
  }
  
  let homeTeam: Team
  let awayTeam: Team
}
