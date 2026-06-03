#!/usr/bin/swift

//
//  generateCSV.swift
//
//  Created by Cosmin Titei on 12/11/2019.
//  Copyright © 2019 PaddyPowerBetfair. All rights reserved.
//

import Foundation

struct BaseDir {
    static private let scriptParts = CommandLine.arguments[0].split(separator: "/")
    static let path = scriptParts[0..<scriptParts.count-1].joined(separator: "/")
}

enum Provider: String, Encodable {
    case blueprint = "Blueprint"
    case igt = "IGT"
    case playtech = "Playtech"
    case rtCay = "RtCay"
    case gpas = "GPAS"
    case pragmatic = "Pragmatic"
    case evolution = "Evolution"
    case everyMatrix = "EveryMatrix"
    case inspired = "Inspired"
    case relax = "Relax"
    case playNGo = "PlayNGo"
    case ggn = "GGN"
}

// swiftlint:disable identifier_name
enum Application: Int, CaseIterable {
    case EmbeddedGameSampleApp = 1 //
    case tbd_native = 3 // The fourth column in the CSV file (counting stating for 0)
    case BFVegasRO
    case BFCasino
    case PPSportsbook
    case PPGames
    case SkyBet
    case SkyCasino
    case SkyVegas
}

struct ProviderConfig {
    let provider: Provider
    var enLanguagePackPattern = ""
    var commonStagingPattern = ""
    var gameFilePattern = ""
    var gameFileNameEnglishOnlyPattern = ".zip$"
    let languagePackPattern = "([\\._]{1}(en))\\.zip"

    init(_ provider: Provider) {
        self.provider = provider
        switch provider {
        case .playtech:
            commonStagingPattern = "stg|stag"
        case .rtCay:
            enLanguagePackPattern = "\\.(en)\\.zip"
        default:
            break
        }
    }
}

enum AssetType: String {
    case game = "Games"
    case common = "Common"
}

struct File: Decodable {
    var size: Int
    var key: String
}

struct RGSCode: Decodable, Encodable {
    var internalCode: Set<String>
    var displayName: String
    var languages: [String] = []
    var provider: String
    var useODRSplit: Bool? = false
}

struct GameList: Decodable, Encodable {
    let gamesData: [String : RGSCode]
    let appEmbeddedPackages: Set<String>
    let timestamp: String
}

struct Assets: Encodable {
    // General attributes
    var fullODRSize: Int = 0
    var totalNumberOfFiles: Int = 0

    // Game specific attributes
    var splitODRSize: Int = 0
    var splitCDNSize: Int = 0

    var files: [String] = []
    var languagePacks: Set<String> = []
}

struct ProviderAssets: Encodable {
    var common: Assets
    var games: [String: Assets] = [:]

    enum CodingKeys: String, CodingKey {
        case common, games
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(common, forKey: .common)
        try container.encode(games, forKey: .games)
    }

    init() {
        common = Assets()
    }
}

struct CSVRow {
    let provider: String
    let rgsCode: String
    let gameName: String
    let currentSelections: String

    // Game Stats
    let fullODRSize: Int
    let splitODRSize: Int
    let splitCDNSize: Int
    let availableLanguagePacks: String

    func sizeToMB(size: Int) -> String {
        return "\(Double(size / 1000) / 1000)MB"
    }

    // Export the data as a CSV row
    func toString() -> String {
        let odrSplittingAvailable = (splitODRSize > 0 && splitCDNSize > 0) ? "Yes" : "No"
        let splitODRSizeValue = splitODRSize > 0 ? "\(self.sizeToMB(size: splitODRSize))" : ""
        let splitCDNSizeValue = splitCDNSize > 0 ? "\(self.sizeToMB(size: splitCDNSize))" : ""

        var row = "\(provider),\(rgsCode),\(gameName),\(currentSelections),\(availableLanguagePacks),\(odrSplittingAvailable),"
        row += "\(self.sizeToMB(size: fullODRSize)),\(splitODRSizeValue),\(splitCDNSizeValue)\n"
        return row
    }
}

struct AssetsManagement {
    var allData: [Provider: ProviderAssets] = [:]
    var gameNames: [String: RGSCode] = [:]
    var oldGamesLists: [Application: [String: RGSCode]] = [:]

    init(withData rawData: Data, prismicData: Data) {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        do {
            // Decode the raw data from AWS S3 source
            let allAssets = try decoder.decode([File].self, from: rawData)

            // Decode the data retrieved from prismic
            gameNames = try decoder.decode([String: RGSCode].self, from: prismicData)

            // Process each item found one by one and save it into the allData dictionary
            for asset in allAssets {
                if isValid(file: asset) {
                    processAsset(asset: asset)
                }
            }
        } catch {
            print("Error")
        }
        oldGamesLists = readPreviousGameLists()
    }

    // Read selected games from the latest configs
    func readPreviousGameLists() -> [Application: [String: RGSCode]] {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        var oldGamesLists: [Application: [String: RGSCode]] = [:]

        for application in Application.allCases {
            do {
                let oldGamesList = try Data(contentsOf: URL(fileURLWithPath: "\(BaseDir.path)/../temp/Apps/\(application)/gamesList.json"),
                                            options: .mappedIfSafe)
                let gamesData = try decoder.decode(GameList.self, from: oldGamesList)
                oldGamesLists[application] = gamesData.gamesData
                print ("Found \(gamesData.gamesData.keys.count) games for \(application) application")
            } catch {
                print ("No gamesList found for \(application)")
            }
        }

        return oldGamesLists
    }

    func isValid(file: File) -> Bool {
        let fileParts = file.key.split(separator: "/", omittingEmptySubsequences: false)
        if Provider(rawValue: String(fileParts[0])) != nil && file.key.hasSuffix(".zip") {
            return true
        }
        return false
    }

    func exportToTextFile(destinationPath: String) {
        let data = convertDataToString()
        do {
            try data.write(
                toFile: "\(destinationPath)",
                atomically: true,
                encoding: .utf8
            )
        } catch {
           print("Error writing: \(error)")
        }
    }

    mutating func processCommonFile(fileParts: [Substring], size: Int) {
        let fileName = String(fileParts[fileParts.count - 1])
        let fileType = String(fileParts[2])

        // Process the file only the provider of this file is valid
        if let provider = Provider(rawValue: String(fileParts[0])) {
            let providerSettings = ProviderConfig(provider)

            // if this is the first file processed for this provider then initialize the ProviderAssets object
            if allData[provider] == nil {
                allData[provider] = ProviderAssets()
            }

            // Match only the production files (Playtech NGM)
            if fileType.range(of: providerSettings.commonStagingPattern, options: .regularExpression) == nil {
                allData[provider]?.common.fullODRSize += size
                allData[provider]?.common.totalNumberOfFiles += 1
                allData[provider]?.common.files.append(fileName)
            }

            //Add dummy game for evolution and calculate the size of bundle-cdn from minio
            if provider == .evolution {
                allData[provider]?.games["allEvolutionGames"] = Assets()
            }
        }
    }

    func extractRgsCode(from fileName: String) -> String {
        var result = fileName
        if let subRange = result.range(of: "(\\.[a-z]{2}-[A-Z]{2}|\\.[a-z]{2}|\\.bare)?\\.zip$", options: .regularExpression) {
            result.replaceSubrange(subRange, with: "")
        }

        if let subRange = result.range(of: "^games.", options: .regularExpression) {
            result.replaceSubrange(subRange, with: "")
        }

        if let subRange = result.range(of: "(-split-odr|-split-cdn)$", options: .regularExpression) {
            result.replaceSubrange(subRange, with: "")
        }

        if let subRange = result.range(of: "_r$", options: .regularExpression) {
            result.replaceSubrange(subRange, with: "")
        }

        return result
    }

    func getLanguagePackSuffixFor(source: String, pattern: String) -> String? {
        if let subRange = source.range(of: pattern, options: .regularExpression) {
            return String(source[subRange])
                .replacingOccurrences(of: "^(\\.|_)", with: "", options: .regularExpression)
                .replacingOccurrences(of: "\\.zip$", with: "", options: .regularExpression)
        }
        return nil
    }

    enum GameFileType {
        case fullODR
        case splitODR
        case splitCDN
    }

    func getGameFileType(fileName: String) -> GameFileType {
        if fileName.hasSuffix("-split-odr.zip") {
            return .splitODR
        }
        if fileName.hasSuffix("-split-cdn.zip") {
            return .splitCDN
        }
        return .fullODR
    }

    mutating func processGameFile(fileParts: [Substring], size: Int) {
        let fileName = String(fileParts[fileParts.count - 1])
        let gameFileType = getGameFileType(fileName: fileName)

        // Extract rgs code
        // process the sizes and the number of files for en/ml
        if let provider = Provider(rawValue: String(fileParts[0])) {
            let providerSettings = ProviderConfig(provider)
            let rgsCode = extractRgsCode(from: fileName)

            // if this is the first file processed for this provider then initialize the ProviderAssets object
            if allData[provider] == nil {
                allData[provider] = ProviderAssets()
            }

            if fileName.range(of: providerSettings.gameFileNameEnglishOnlyPattern, options: .regularExpression) != nil {

                var currentGame = Assets()
                if let existingGameData = allData[provider]?.games[rgsCode] {
                    currentGame = existingGameData
                }

                switch gameFileType {
                case .splitODR:
                    currentGame.splitODRSize = size
                case .splitCDN:
                    currentGame.splitCDNSize = size
                default:
                    currentGame.fullODRSize += size
                    currentGame.totalNumberOfFiles += 1
                    currentGame.files.append(fileName)
                    if let lang = getLanguagePackSuffixFor(source: fileName, pattern: providerSettings.enLanguagePackPattern) {
                        currentGame.languagePacks.insert(lang)
                    }
                }
                allData[provider]?.games[rgsCode] = currentGame
            }
        }
    }

    // Process a package. The processed data will be saved into allData
    mutating func processAsset(asset: File) {
        let fileParts = asset.key.split(separator: "/", omittingEmptySubsequences: false)

        if Provider(rawValue: String(fileParts[0])) != nil,
            let assetType = AssetType(rawValue: String(fileParts[1])) {

            switch assetType {
            case .game:
                processGameFile(fileParts: fileParts, size: asset.size)
            case .common:
                processCommonFile(fileParts: fileParts, size: asset.size)
            }
        }
        return
    }

    // Extract the data
    func getOldGameSelection(rgsCode: String) -> String {
        // save the selected value for each Application from the latest configs as a comma separated string
        var selectedValues: [String] = []
        for application in Application.allCases {
            guard application != .EmbeddedGameSampleApp else { continue }
            var selectedAppValue = ""

            if let gamesList = oldGamesLists[application],
               let game = gamesList[rgsCode] {
                selectedAppValue = game.languages.isEmpty ? "X" : game.languages.joined(separator: "|")
            } else if rgsCode == "allEvolutionGames",
                      let gamesList = oldGamesLists[application],
                      gamesList.first(where: { $0.value.provider == "gp-evl" }) != nil {

                // We won't enumerate each Evolution game in the CSV since we have a single framework file,
                selectedAppValue = "X"
            }
            selectedValues.append(selectedAppValue)
        }

        return selectedValues.joined(separator: ",")
    }

    func convertDataToString() -> String {
        // The header columns row
        var resultData = [
            "Provider", "Game", "Game Name",
            "BF Rebuild", "BF Vegas RO", "BF Casino",
            "PP Sportsbook", "PP Games",
            "Sky Bet", "Sky Casino", "Sky Vegas",
            "Available Language Packs","ODR Split Available",
            "Full Size", "Split Size - ODR", "Split Size - CDN"
            ].joined(separator: ",") + "\n"

        // compute each row in the CSV file iterating through each provider and having a line for each game
        for (provider, currentProviderData) in allData.sorted(by: { $0.key.rawValue < $1.key.rawValue }) {
            for (rgsCode, currentGameData) in currentProviderData.games.sorted(by: { $0.key < $1.key }) {
                if provider == .rtCay {
                    /// Try to fix issue when RedTiger games language packs are added to the source location without
                    //  the game core package which is a required package in order to properly launch a Red Tiger game,
                    //  language packs being optional.
                    if !currentGameData.files.contains("games.\(rgsCode).zip") {
                        print("The game \(gameNames[rgsCode]?.displayName ?? "") - \(rgsCode) is missing the game core package, it will be skipped")
                        continue
                    }
                }
                let gameRow = CSVRow(provider: provider.rawValue,
                                     rgsCode: rgsCode,
                                     gameName: gameNames[rgsCode]?.displayName ?? "",
                                     currentSelections: getOldGameSelection(rgsCode: rgsCode),
                                     fullODRSize: currentGameData.fullODRSize,
                                     splitODRSize: currentGameData.splitODRSize,
                                     splitCDNSize: currentGameData.splitCDNSize,
                                     availableLanguagePacks: currentGameData.languagePacks.joined(separator: "|"))

                resultData += gameRow.toString()
            }
        }

        return resultData
    }
}

//Todo - add input params with files paths for profiling games for specified apps

do {
    let rawData = try Data(contentsOf: URL(fileURLWithPath: "\(BaseDir.path)/../temp/raw-data.json"), options: .mappedIfSafe)
    let prismicData = try Data(contentsOf: URL(fileURLWithPath: "\(BaseDir.path)/../temp/prismic/EmbeddedGameSampleApp.json"), options: .mappedIfSafe)
    let assets = AssetsManagement(withData: rawData, prismicData: prismicData)

    assets.exportToTextFile(destinationPath: "\(BaseDir.path)/../temp/allGames.csv")
}
