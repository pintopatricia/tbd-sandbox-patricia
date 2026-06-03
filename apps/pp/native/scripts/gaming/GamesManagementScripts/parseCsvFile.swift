#!/usr/bin/swift

//  parseCsvFile.swift
//
//  Created by Cosmin Titei on 28/10/2019.
//  Copyright © 2019 PaddyPowerBetfair. All rights reserved.

import Foundation

struct BaseDir {
    static private let scriptParts = CommandLine.arguments[0].split(separator: "/")
    static let path = scriptParts[0..<scriptParts.count-1].joined(separator: "/")
}

// swiftlint:disable identifier_name
enum Provider: String, Codable {
    case blueprint = "Blueprint"
    case gpas = "GPAS"
    case igt = "IGT"
    case playtech = "Playtech"
    case rtCay = "RtCay"
    case pragmatic = "Pragmatic"
    case evolution = "Evolution"
    case everyMatrix = "EveryMatrix"
    case inspired = "Inspired"
    case relax = "Relax"
    case playNGo = "PlayNGo"
    case ggn = "GGN"
}

enum PrismicRepoPrefix: String, CaseIterable {
    case BFInternational = "gmbcom"
    case BFItaly = "gmbit"
    case BFSpain = "gmbes"
    case BFDenmark = "gmbdk"
    case BFSweden = "gmbse"
    case BFRomania = "gmbro"
    case PPInternational = "gmpcom"
}

enum Language: String {
    case en = "en-GB"

    init?(shortCode: String) {
        switch shortCode {
        case "en":
            self = .en
        default:
            return nil
        }
    }

    var shortCode: String {
        get { return String(describing: self)}
    }

    var longCode: String {
        get { return self.rawValue}
    }
}

enum Application: Int, CaseIterable {
    case EmbeddedGameSampleApp = 1
    case tbd_native = 3
    case BFVegasRO
    case BFCasino
    case PPSportsbook
    case PPGames
    case SkyBet
    case SkyCasino
    case SkyVegas
}

struct ScriptOptions {
    var providers: [Provider] = []
    var apps: [Application] = []
    var games: [String] = []
    var installedGames: [String] = []
    var shouldAddLive:Bool = true
    var shouldUseODRSplit: Bool = false
}

struct ApplicationConfig {
    var application: Application
    var jurisdictions: [PrismicRepoPrefix] = []
    var evolutionProviderCodes = ["gp-ev", "gp-evl"]
    var liveCasinoRgsCodes = ["3brgl", "7eml", "abjl", "abl", "abwl", "aogjbrol", "bal", "bbwl", "bfbl", "bfbl_g",
                              "bjl", "brag", "bs_bal", "bs_pokl", "cbjl", "chel", "cml", "cspljpt", "dndbngl", "dtl",
                              "ejpl", "fbbjl", "fbbl", "fbrol", "frofl", "frol", "hilo", "hilol", "jmnjl", "jsrrl",
                              "mdl", "mjpswl", "msbjl", "nc_bal", "qabjlp", "qrol", "rodzl", "rofl", "rol", "rosz",
                              "sbdl", "sgrol", "sprol", "swl", "tgcsl", "ubal", "ubjl", "wwtbamrol"]
    // Common files per provider (some of them have different files based on the brand/application)
    var commonAssets: [Provider: Set<String>] = [:]

    // swiftlint:disable function_body_length
    init(application: Application) {
        self.application = application

        commonAssets[.blueprint] = [
            "loader.zip",
            "qBridge.zip"
        ]
        commonAssets[.gpas] = ["glu.zip"]
        commonAssets[.igt] = ["igt-core.zip"]
        commonAssets[.relax] = ["apex.zip"]
        commonAssets[.playtech] = []
        commonAssets[.rtCay] = []
        commonAssets[.pragmatic] = ["ppbf-game-loader.zip"]
        commonAssets[.evolution] = ["bundle-cdn.zip"]
        commonAssets[.everyMatrix] = []
        commonAssets[.playNGo] = ["gameloader.zip"]
        commonAssets[.ggn] = ["common.zip"]

        switch application {
        case .EmbeddedGameSampleApp:
            jurisdictions = [.BFInternational, .BFSweden, .BFSpain, .BFItaly, .BFDenmark, .BFRomania, .PPInternational]
            commonAssets[.rtCay] = [
                "betfairMars.core.zip",
                "paddyMars.core.zip"
            ]
            commonAssets[.playtech] = [
                "betfaircasino.com-betfaircasino.com.zip",
                "betfair.dk.zip",
                "betfair.it.zip",
                "betfaircasino.se.zip",
                "betfaircasinoew5.es.zip",
                "betfaircasino.ro.zip",
                "paddypowercasino.com-paddypowercasino.com.zip",
                "betfaircasinostg.com.zip",
                "ptstaging1.03.zip",
                "betfaircasinostg.dk.zip",
                "betfaircasinostg.es.zip",
                "betfaircasinostg.ro.zip",
                "betfaircasinostg.se.zip",
                "paddypowercasinostg.zip"
            ]
        case .BFCasino, .tbd_native:
            commonAssets[.playtech] = [
                "betfaircasino.com-betfaircasino.com.zip",
                "betfair.dk.zip",
                "betfaircasinoew5.es.zip",
                "betfair.it.zip",
                "betfaircasino.ro.zip",
                "betfaircasino.se.zip"
            ]
            commonAssets[.rtCay] = ["betfairMars.core.zip"]
            jurisdictions = [.BFInternational, .BFDenmark, .BFRomania, .BFItaly, .BFSweden, .BFSpain]
        case .BFVegasRO:
            commonAssets[.playtech] = ["betfaircasino.ro.zip"]
            jurisdictions = [.BFRomania]
        case .PPSportsbook, .PPGames, .SkyBet, .SkyCasino, .SkyVegas:
            commonAssets[.playtech] = ["paddypowercasino.com-paddypowercasino.com.zip"]
            commonAssets[.rtCay] = ["paddyMars.core.zip"]
            jurisdictions = [.PPInternational]
        }
    }
}

struct RGSCode: Decodable, Encodable {
    var internalCode: Set<String>
    var displayName: String
    var languages: [String] = []
    var provider: String
    var useODRSplit: Bool = false

    func sorted() -> GameWithSortedCode {
        return GameWithSortedCode(internalCode: self.internalCode.sorted(),
                                  displayName: self.displayName,
                                  languages: self.languages,
                                  provider: self.provider,
                                  useODRSplit: self.useODRSplit)
    }
}

// New struct with sorted codes
struct GameWithSortedCode: Encodable {
    var internalCode: [String]
    var displayName: String
    var languages: [String] = []
    var provider: String
    var useODRSplit: Bool = false
}

enum ResourceType: String, Codable {
    /// resource as embedded into the application bundle
    case bundle
    // resource added as on demand resource
    case odr
    // resource added as on demand resource but only the slimmed file the other part being served from a CDN location
    case odrSplit
}

struct ProviderAssets: Decodable, Encodable {
    var common: [String: ResourceType] = [:]
    var games: [String: ResourceType] = [:]
}

struct ApplicationAssets {

    func exportAssetsToCopy(assets: [String: ProviderAssets], application: Application) {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .prettyPrinted]
        do {
            let data = try encoder.encode(assets)
            let jsonString = String(data: data, encoding: .utf8)!

            try jsonString.write(
                toFile: "\(BaseDir.path)/../temp/\(application)-assetsToCopy.json",
                atomically: true,
                encoding: .utf8
            )
        } catch {
           print("Error writing: \(error)")
        }
    }

    func exportGameList(gamesData: [String : RGSCode], embeddedAssets: Set<String>, application: Application) {

        struct GameList: Encodable {
            let gamesData: [String : GameWithSortedCode]
            let appEmbeddedPackages: Set<String>
            let timestamp: String
        }

        let gameList = GameList(gamesData: gamesData.mapValues { game in game.sorted()},
                                appEmbeddedPackages: embeddedAssets,
                                timestamp: getTimestamp())

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .prettyPrinted]
        do {
            let data = try encoder.encode(gameList)
            let jsonString = String(data: data, encoding: .utf8)!

            try jsonString.write(
                toFile: "\(BaseDir.path)/../temp/\(application)-gamesList.json",
                atomically: true,
                encoding: .utf8
            )
        } catch {
           print("Error writing: \(error)")
        }
    }

    func getTimestamp() -> String {
        let now = Date()
        let formatter = DateFormatter()
        formatter.timeZone = TimeZone.current
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        let dateString = formatter.string(from: now)
        return dateString
    }

    func getGameFilesFor(rgsCode: String,
                         application: Application,
                         provider: Provider,
                         languagePacks: [String],
                         embeddedLanguagePacks: [String],
                         selectedOptions: String,
                         useSplitOdr: Bool,
                         assetsToCopyData: inout [String: ProviderAssets]) {


        let applicationConfig = ApplicationConfig(application: application)
        var gamePackagePatterns = [String]()
        var gameLanguagePackPattern: String?
        let packageSuffix = ".zip"

        // Flags for determining if common packages or/and game packages should be added to the application without ODR tags
        let (shouldEmbedCommonPackages,
             shouldEmbedGamePackages) = self.getSelectedEmbeddedAssets(selectedOptions: selectedOptions)

        switch provider {
        case .blueprint, .gpas, .igt, .relax, .playtech, .inspired, .playNGo, .everyMatrix, .ggn:
            gamePackagePatterns.append("%rgsCode%")
        case .rtCay:
            gamePackagePatterns.append("games.%rgsCode%")
            gameLanguagePackPattern = "games.%rgsCode%.%language%"
        case .pragmatic:
            gamePackagePatterns.append("%rgsCode%_r")
        case .evolution:
            break
        }
        var currentProviderData = ProviderAssets()
        if let providerAssets = assetsToCopyData[provider.rawValue] {
            currentProviderData = providerAssets
        }

        // Add common files to the resulting data (assetsToCopyData) - preserve the embedded status
        let commonAssets = applicationConfig.commonAssets[provider] ?? []
        for asset in commonAssets {
            if let assetEmbedded = currentProviderData.common[asset] {
                currentProviderData.common[asset] = (assetEmbedded == .bundle || shouldEmbedCommonPackages) ? .bundle : .odr
            } else {
                currentProviderData.common[asset] = shouldEmbedCommonPackages ? .bundle : .odr
            }
        }

        for gamePackagePattern in gamePackagePatterns {
            if var gameCommonAsset = gamePackagePattern as String?,
               let subRange = gameCommonAsset.range(of: "%rgsCode%", options: .regularExpression) {
                    gameCommonAsset.replaceSubrange(subRange, with: rgsCode)
                    gameCommonAsset += packageSuffix
                    let odrType:ResourceType = useSplitOdr ? .odrSplit : .odr
                    currentProviderData.games[gameCommonAsset] = shouldEmbedGamePackages ? .bundle : odrType
            }
        }

        if let gameLanguagePackPattern = gameLanguagePackPattern {
            for language in languagePacks {
                var gameLanguagePackAsset = gameLanguagePackPattern
                if let subRange = gameLanguagePackAsset.range(of: "%rgsCode%", options: .regularExpression) {
                    gameLanguagePackAsset.replaceSubrange(subRange, with: rgsCode)
                }
                if let subRange = gameLanguagePackAsset.range(of: "%language%", options: .regularExpression) {
                    gameLanguagePackAsset.replaceSubrange(subRange, with: language)
                }
                gameLanguagePackAsset += packageSuffix
                currentProviderData.games[gameLanguagePackAsset] = (shouldEmbedGamePackages && gameLanguagePackAsset.contains(language)) ? .bundle : .odr
            }
        }
        assetsToCopyData[provider.rawValue] = currentProviderData
    }

    func getPrismicDataFor(application: Application) -> [String: RGSCode] {
        var prismicData:[String: RGSCode] = [:]
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        do {
            let rawPrismicData = try Data(contentsOf: URL(fileURLWithPath: "\(BaseDir.path)/../temp/prismic/\(application).json"),
                                       options: .mappedIfSafe)

            prismicData = try decoder.decode([String: RGSCode].self, from: rawPrismicData)

        } catch {
            print("Error passing prismic data")
        }

        return prismicData
    }

    func getLiveCasinoGamesFor(application: Application,
                               allPrismicRGSCodes: [String : RGSCode]) -> [String: RGSCode] {

        let applicationConfig = ApplicationConfig(application: application)
        var liveCasinoGames:[String: RGSCode] = [:]

        for rgsCode in applicationConfig.liveCasinoRgsCodes {
            if let prismicGame = allPrismicRGSCodes[rgsCode] {
                liveCasinoGames[rgsCode] = prismicGame
            }
        }

        return liveCasinoGames
    }

    func getEvolutionGames(application: Application,
                           allPrismicRGSCodes: [String : RGSCode]) -> [String : RGSCode] {
        let applicationConfig = ApplicationConfig(application: application)
        var evolutionGames: [String: RGSCode] = [:]

        for (elementKey, elementValue) in allPrismicRGSCodes {
            if applicationConfig.evolutionProviderCodes.contains(elementValue.provider) {

                evolutionGames[elementKey] = elementValue
            }
        }

        return evolutionGames
    }

    func getSelectedEmbeddedAssets(selectedOptions: String) -> (shouldEmbedCommonPackages: Bool,
                                                                shouldEmbedGamePackages: Bool) {

        var shouldEmbedCommonPackages = false
        var shouldEmbedGamePackages = false

        if !selectedOptions.isEmpty {
            if (selectedOptions.lowercased().hasPrefix("bundlecommon")) {
                shouldEmbedCommonPackages = true
            }
            if (selectedOptions.lowercased().hasPrefix("bundlegame")) {
                shouldEmbedCommonPackages = true
                shouldEmbedGamePackages = true
            }
        }
        return (shouldEmbedCommonPackages, shouldEmbedGamePackages)
    }

    func getGameLanguagesPacks(selectedLanguages: String,
                               availableLanguages: String,
                               onlyEmbeddedPacks: Bool = false) -> Set<Language>? {
        guard !selectedLanguages.isEmpty  else { return nil }

        var availableLanguagePacks: Set<Language> = availableLanguages.components(separatedBy: "|").reduce(into: [] , { result, lang in
            if let languageFromLongCode = Language(rawValue: lang) {
                result.insert(languageFromLongCode)
            }
            if let languageFromShortCode = Language(shortCode: lang) {
                result.insert(languageFromShortCode)
            }
        })

        if availableLanguagePacks.isEmpty {
            return []
        }

        var selectedLanguagePacks: Set<Language>
        if selectedLanguages.lowercased() == "x" {
            selectedLanguagePacks = availableLanguagePacks
        } else if selectedLanguages.lowercased().hasPrefix("bundle") && onlyEmbeddedPacks == false {
                selectedLanguagePacks = availableLanguagePacks
        } else {
            selectedLanguagePacks = selectedLanguages.components(separatedBy: "|").reduce(into: [] , { result, lang in
                if let languageFromLongCode = Language(rawValue: lang) {
                    result.insert(languageFromLongCode)
                }
                if let languageFromShortCode = Language(shortCode: lang) {
                    result.insert(languageFromShortCode)
                }
            })
        }
        availableLanguagePacks.formIntersection(selectedLanguagePacks)
        if availableLanguagePacks.isEmpty {
            return nil
        }

        return availableLanguagePacks
    }

    func exportSelectedLanguagePacks(selectedLanguagesPacks: Set<Language>,
                                     availableLanguages: String) -> [String] {
        guard !availableLanguages.isEmpty else { return [] }

        return availableLanguages.components(separatedBy: "|").reduce(into: [] , { result, lang in
            if let longCode = Language(rawValue: lang), selectedLanguagesPacks.contains(longCode) {
                result.append(lang)
            }
            if let shortCode = Language(shortCode: lang), selectedLanguagesPacks.contains(shortCode) {
                result.append(lang)
            }
        })
    }

    func getEmbeddedAssets(allAssets: [String: ProviderAssets]) -> Set<String> {
        var embeddedAssets: Set<String> = []
        for (provider, providerData) in allAssets {
            // extract common assets
            for (asset, embedded) in providerData.common {
                if embedded == .bundle  {
                    embeddedAssets.insert("\(provider).\(asset)")
                }
            }

            // Extract game assets
            for (asset, embedded) in providerData.games {
                if embedded == .bundle {
                    embeddedAssets.insert(asset)
                }
            }
        }

        return embeddedAssets
    }

    func extractGamesFrom(content: String,
                          application: Application,
                          options: ScriptOptions) -> ([String: RGSCode],
                                                      [String: ProviderAssets],
                                                      Set<String>) {

        var assetsToCopyData: [String: ProviderAssets] = [:]
        let allPrismicRGSCodes = getPrismicDataFor(application: application)
        var gamesListData: [String: RGSCode] = [:]
        if options.shouldAddLive {
            gamesListData = getLiveCasinoGamesFor(application: application, allPrismicRGSCodes: allPrismicRGSCodes)
        }

        // Three columns for Provider, game name and game code, followed by the apps (removing the SampleApp
        // since it is not in the csv file)
        let availableLanguagePacksColumn = 3 + (Application.allCases.count - 1)
        let odrSplitAvailableColumn = availableLanguagePacksColumn + 1

        // Process all line form the .csv file
        content.enumerateLines(invoking: { (line, _) in
            let columns = line.split(separator: ",", omittingEmptySubsequences: false)
            // Each line in the .csv file should have 15 columns
            //   - first 3 are Provider, RGS Code, Game Name
            //   - next 8 are Application options
            //   - then Available Language Packs for the current game
            //   - last 4 with information about the game sizes and number of packages
            guard columns.count == (8 + Application.allCases.count - 1) else {
                print("Error. Invalid number of columns on the line: ", columns)
                return
            }

            let rgsCode = columns[1].trimmingCharacters(in: .whitespacesAndNewlines)
            let applicationSelectedOptions = application == .EmbeddedGameSampleApp ? "X" : columns[application.rawValue].trimmingCharacters(in: .whitespacesAndNewlines)

            guard let provider = Provider(rawValue: String(columns[0])) else { return }
            guard !applicationSelectedOptions.isEmpty else { return }

            if provider != .evolution && !rgsCode.isEmpty {
                // if the current game is not present in the list of games to install then skip it
                if !options.providers.isEmpty && !options.installedGames.contains(rgsCode) && !options.providers.contains(provider) {
                    return
                }

                // if the current game is not present in the list of games to install then skip it
                if !options.games.isEmpty && !(options.games.contains(rgsCode) || options.installedGames.contains(rgsCode)) {
                    return
                }

                // if selectedGameLanguagesPacks in not nil add the game or else skip it
                if let selectedGameLanguagesPacks = self.getGameLanguagesPacks(selectedLanguages: applicationSelectedOptions,
                                                                               availableLanguages: String(columns[availableLanguagePacksColumn])) {

                    // Compute the list of language packs for the current game
                    let currentGameLanguagePacks = self.exportSelectedLanguagePacks(selectedLanguagesPacks: selectedGameLanguagesPacks,
                                                                                    availableLanguages: String(columns[availableLanguagePacksColumn]))
                    // Compute the list of language packs for the current game that will be embedded into the app bundle

                    var currentGameEmbeddedLanguagePacks: [String] = []
                    if let selectedEmbeddedGameLanguagesPacks = self.getGameLanguagesPacks(selectedLanguages: applicationSelectedOptions,
                                                                                           availableLanguages: String(columns[availableLanguagePacksColumn]),
                                                                                           onlyEmbeddedPacks: true) {
                        currentGameEmbeddedLanguagePacks = self.exportSelectedLanguagePacks(selectedLanguagesPacks: selectedEmbeddedGameLanguagesPacks,
                                                                                            availableLanguages: String(columns[availableLanguagePacksColumn]))
                    }

                    if var prismicGame = allPrismicRGSCodes[rgsCode] {
                        let useOdrSplit = options.shouldUseODRSplit && String(columns[odrSplitAvailableColumn]) == "Yes"
                        // build the list of assets for the current game taking into account also the selected language packs
                        self.getGameFilesFor(rgsCode: rgsCode,
                                             application: application,
                                             provider: provider,
                                             languagePacks: currentGameLanguagePacks,
                                             embeddedLanguagePacks: currentGameEmbeddedLanguagePacks,
                                             selectedOptions: applicationSelectedOptions,
                                             useSplitOdr: useOdrSplit,
                                             assetsToCopyData: &assetsToCopyData)

                        if var currentGame = gamesListData[rgsCode] {
                            currentGame.internalCode.formUnion(prismicGame.internalCode)
                            currentGame.displayName = prismicGame.displayName
                            currentGame.languages = currentGameLanguagePacks
                            currentGame.useODRSplit = useOdrSplit
                        } else {
                            prismicGame.languages = currentGameLanguagePacks
                            prismicGame.useODRSplit = useOdrSplit
                            gamesListData[rgsCode] = prismicGame
                        }
                    }
                }
            } else {
                // if the current game is not present in the list of games to install then skip it
                if !options.providers.isEmpty && !options.providers.contains(provider) && provider == .evolution {
                     return
                }

                let applicationConfig = ApplicationConfig(application: application)
                var currentProviderData = ProviderAssets()
                let commonAsset = applicationConfig.commonAssets[provider]?.first
                let (shouldEmbedCommonPackages, _) = self.getSelectedEmbeddedAssets(selectedOptions: applicationSelectedOptions)
                if let evolutionCommonPackage = commonAsset {
                    currentProviderData.common[evolutionCommonPackage] = shouldEmbedCommonPackages ? .bundle : .odr
                    assetsToCopyData[provider.rawValue] = currentProviderData
                }

                let allEvolutionGames = getEvolutionGames(application: application, allPrismicRGSCodes: allPrismicRGSCodes)
                gamesListData.merge(allEvolutionGames){(current, _) in current}
            }
        })
        let embeddedAssets = getEmbeddedAssets(allAssets: assetsToCopyData)
        return (gamesListData, assetsToCopyData, embeddedAssets)
    }
}

func parseArguments(_ args: [String]) -> ScriptOptions {
    var options = ScriptOptions()
    let arguments = args[1 ..< args.endIndex]
    for argument in arguments {
        if argument.hasPrefix("--apps=") {
            let applicationsValue = String(argument.dropFirst(7))
                .split(separator: ",", omittingEmptySubsequences: false)

            for applicationValue in applicationsValue {
                if let rawAppValue = Int(String(applicationValue)),
                    let application = Application(rawValue: rawAppValue) {
                    options.apps.append(application)
                } else {
                    print("Invalid value provided for the --applications flag, use number values from separated by comma:")
                    for application in Application.allCases {
                        print("\(application.rawValue): \(application)")
                    }
                    exit(0)
                }
            }
        }

        if argument.hasPrefix("--providers=") {
            let providersValue = String(argument.dropFirst(12))
                .split(separator: ",", omittingEmptySubsequences: false)

            for providerValue in providersValue {
                if let provider = Provider(rawValue: String(providerValue)) {
                    options.providers.append(provider)
                } else if !providerValue.isEmpty && providerValue != "ALL" {
                    print("Invalid value provided for the --provider flag, use one of the following values: Blueprint, GGN, GPAS, IGT, Playtech, RtCay, Pragmatic, PlayNGo, EveryMatrix or ALL")
                    exit(1)
                }
            }
        }

        if argument.hasPrefix("--games=") {
            let gamesValue = String(argument.dropFirst(8))
                .split(separator: ",", omittingEmptySubsequences: false)

            for gameValue in gamesValue {
                let game = String(gameValue)
                if !game.isEmpty {
                    options.games.append(game)
                }
            }
        }

        if argument.hasPrefix("--installed-games=") {
            let gamesValue = String(argument.dropFirst(18))
                .split(separator: ",", omittingEmptySubsequences: false)

            for gameValue in gamesValue {
                let game = String(gameValue)
                if !game.isEmpty {
                    options.installedGames.append(game)
                }
            }
        }

        if argument.hasPrefix("--skip-live") {
            options.shouldAddLive = false
        }

        if argument.hasPrefix("--odr-split") {
            options.shouldUseODRSplit = true
        }
    }

    if options.apps.isEmpty {
       options.apps = Application.allCases
    }

    return options
}

do {
    var scriptOptions = ScriptOptions()
    if CommandLine.argc < 2 {
        print("No arguments are passed.")
    } else {
        scriptOptions = parseArguments(CommandLine.arguments)
    }

    // Read an entire text file into an NSString.
    // TODO: handle missing or errors opening the csv file.
    let contents = try String(contentsOfFile: "\(BaseDir.path)/../temp/allGames.csv", encoding: .utf8)

    let assets = ApplicationAssets()

    for application in scriptOptions.apps {
        let (gamesListData, assetsToCopyData, embeddedAssets) = assets.extractGamesFrom(content: contents,
                                                                                        application: application,
                                                                                        options: scriptOptions)
        assets.exportAssetsToCopy(assets: assetsToCopyData, application: application)
        assets.exportGameList(gamesData: gamesListData, embeddedAssets: embeddedAssets, application: application)
    }
}
