#!/usr/bin/swift

//
//  getPrismicData.swift
//
//  Created by Cosmin Titei on 23/01/2020.
//  Copyright © 2020 PaddyPowerBetfair. All rights reserved.
//

import Foundation

struct BaseDir {
    static private let scriptParts = CommandLine.arguments[0].split(separator: "/")
    static let path = scriptParts[0..<scriptParts.count-1].joined(separator: "/")
}

// swiftlint:disable identifier_name
enum Application: Int, CaseIterable {
    case EmbeddedGameSampleApp = 1
    case tbd_native = 3 // Starts from 3 since this Application will be on column 3 on the allGames.csv file
    case BFVegasRO
    case BFCasino
    case PPSportsbook
    case PPGames
    case SkyBet
    case SkyCasino
    case SkyVegas
}

enum Environment: String, CaseIterable {
    case dev = "-dev"
    case prod = ""
}

struct ScriptOptions {
    var env: Environment?
    var apps: [Application] = []
}

enum PrismicRepoPrefix: String, CaseIterable {
    case BFInternational = "betfair-com"
    case BFItaly = "betfair-it"
    case BFSpain = "betfair-es"
    case BFDenmark = "betfair-dk"
    case BFSweden = "betfair-se"
    case BFRomania = "betfair-ro"
    case PPInternational = "paddypower-com"
    case SkyInternational = "skybettingandgaming-com"
}

struct ApplicationConfig {
    var application: Application
    var jurisdictions: [PrismicRepoPrefix] = []
    var environments: [Environment] = [.prod]

    // swiftlint:disable function_body_length
    init(application: Application, environment: Environment? = nil) {
        self.application = application
        switch application {
        case .EmbeddedGameSampleApp:
            jurisdictions = [
                .BFInternational, .BFSweden, .BFSpain, .BFItaly, .BFDenmark, .BFRomania,
                .PPInternational,
                .SkyInternational
            ]
            environments = [.dev, .prod]
        case .BFCasino:
            jurisdictions = [.BFInternational, .BFDenmark, .BFSweden, .BFSpain]
        case .tbd_native:
            jurisdictions = [.BFInternational, .BFDenmark, .BFRomania, .BFItaly, .BFSweden, .BFSpain]
        case .BFVegasRO:
            jurisdictions = [.BFRomania]
        case .PPSportsbook, .PPGames:
            jurisdictions = [.PPInternational]
        case .SkyBet, .SkyCasino, .SkyVegas:
            jurisdictions = [.SkyInternational]
        }

        // Override the environment with the one provided on init
        if let env = environment {
            environments = [env]
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

struct MasterRef: Decodable {
    var ref: String?
    var label: String = ""

    enum RootKeys: String, CodingKey {
        case refs
    }

    enum RefsKeys: String, CodingKey {
        case id, ref, label, isMasterRef
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: RootKeys.self)

        // Extract the master ref key
        var refsUnkeyedContainer = try container.nestedUnkeyedContainer(forKey: .refs)

        while !refsUnkeyedContainer.isAtEnd {
            let refContainer = try refsUnkeyedContainer.nestedContainer(keyedBy: RefsKeys.self)
            if let isMasterRef = try refContainer.decodeIfPresent(Bool.self, forKey: .isMasterRef),
               isMasterRef == true {
                ref = try refContainer.decode(String.self, forKey: .ref)
                label = try refContainer.decode(String.self, forKey: .label)
                break
            }
        }
    }
}

struct SearchResult: Decodable, Encodable {
    var page: Int
    var totalPages: Int
    var results: [Game]

    init() {
        page = 0
        totalPages = 0
        results = []
    }
}

struct Game: Decodable, Encodable {
    var name: String?
    var displayName: String?
    var internalCode: String?
    var rgsCodeMobile: String?
    var provider: String?

    enum RootKeys: String, CodingKey {
        case data
    }

    enum DataKeys: String, CodingKey {
        case name, displayName, internalCode, rgsCodeMobile, provider
    }

    enum NameKeys: String, CodingKey {
        case text
    }

    enum ProviderKeys: String, CodingKey {
        case uid
    }

    enum CodingKeys: String, CodingKey {
        case name, displayName, internalCode, rgsCodeMobile, provider
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: RootKeys.self)

        // data container
        let dataContainer = try container.nestedContainer(keyedBy: DataKeys.self, forKey: .data)
        internalCode = try dataContainer.decodeIfPresent(String.self, forKey: .internalCode)
        rgsCodeMobile = try dataContainer.decodeIfPresent(String.self, forKey: .rgsCodeMobile)

        // Name
        var nameUnkeyedContainer = try dataContainer.nestedUnkeyedContainer(forKey: .name)
        if let nameCount = nameUnkeyedContainer.count, nameCount > 0 {
            let nameContainer = try nameUnkeyedContainer.nestedContainer(keyedBy: NameKeys.self)
            name = try nameContainer.decodeIfPresent(String.self, forKey: .text)
        }

        // Name
        var displayNameUnkeyedContainer = try dataContainer.nestedUnkeyedContainer(forKey: .displayName)
        if let displayNameCount = displayNameUnkeyedContainer.count, displayNameCount > 0 {
            let displayNameContainer = try displayNameUnkeyedContainer.nestedContainer(keyedBy: NameKeys.self)
            displayName = try displayNameContainer.decodeIfPresent(String.self, forKey: .text)
        }

        // Provider
        let providerContainer = try dataContainer.nestedContainer(keyedBy: ProviderKeys.self, forKey: .provider)
        provider = try providerContainer.decodeIfPresent(String.self, forKey: .uid)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(name, forKey: .name)
        try container.encode(displayName, forKey: .displayName)
        try container.encode(internalCode, forKey: .internalCode)
        try container.encode(rgsCodeMobile, forKey: .rgsCodeMobile)
        try container.encode(provider, forKey: .provider)
    }
}

class PrismicGameService: NSObject {
    func extractGamesFrom(output: Data) -> SearchResult? {
        var result: SearchResult?
        do {
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            result = try decoder.decode(SearchResult.self, from: output)
        } catch {
            print("Failed to decode - \(error)")
            exit(EXIT_FAILURE)
        }

        return result
    }

    private func getApiUrl(prismicRepoPrefix: PrismicRepoPrefix,
                           environment: Environment,
                           forSearch: Bool = false,
                           masterRef: String? = nil,
                           page: Int = 1) -> URL? {

        var urlComponents = URLComponents()
        urlComponents.scheme = "https"
        urlComponents.host = "\(prismicRepoPrefix.rawValue)\(environment.rawValue).cdn.prismic.io"

        if forSearch {
            if let masterRef = masterRef {
                urlComponents.path = "/api/v2/documents/search"
                urlComponents.queryItems = [
                   URLQueryItem(name: "ref", value: masterRef),
                   URLQueryItem(name: "pageSize", value: String(100)),
                   URLQueryItem(name: "page", value: String(page)),
                   URLQueryItem(name: "q", value: "[[at(document.type,\"game\")]]")
                ]
            } else {
                return nil
            }
        } else {
            urlComponents.path = "/api/v2"
        }

        return urlComponents.url
    }

    func fetchMasterRef(prismicRepoPrefix: PrismicRepoPrefix, environment: Environment) -> String? {
        var masterRef: String?
        let sema = DispatchSemaphore(value: 0)

        if let url = getApiUrl(prismicRepoPrefix: prismicRepoPrefix, environment: environment) {
            URLSession.shared.dataTask(with: url) { data, _, _ in
                if let data = data {
                    // Extract the masterRef from the call output
                    do {
                        let output = try JSONDecoder().decode(MasterRef.self, from: data)
                        if let ref = output.ref {
                            masterRef = ref
                        }
                    } catch {
                        print("Failed to decode - \(error)")
                        exit(EXIT_FAILURE)
                    }
                    sema.signal()
                }
            }.resume()
            sema.wait() // sets the process to wait
        }
        return masterRef
    }

    func fetchGames(prismicRepoPrefix: PrismicRepoPrefix,
                    environment: Environment,
                    masterRef: String? = nil,
                    page: Int = 1,
                    result: inout [Game]) {

        var validMasterRef: String?
        if let masterRef = masterRef {
            validMasterRef = masterRef
        } else {
           if let newMasterRef = fetchMasterRef(prismicRepoPrefix: prismicRepoPrefix, environment: environment) {
               validMasterRef = newMasterRef
           } else {
                print("No valid masterRef!!!")
                return
            }
        }

        let sema = DispatchSemaphore( value: 0)
        var searchResult: [Game] = []
        var nextPage: Int?
        let apiUrl = getApiUrl(prismicRepoPrefix: prismicRepoPrefix,
                               environment: environment,
                               forSearch: true,
                               masterRef: validMasterRef,
                               page: page)

        if let url = apiUrl {
            URLSession.shared.dataTask(with: url) { data, _, _ in
                if let data = data {
                    // Try to decode the response
                    if let gamesSearch = self.extractGamesFrom(output: data) {
                        // Save the games to teh result list
                        searchResult = gamesSearch.results

                        // prepare the call for the next page
                        if gamesSearch.page < gamesSearch.totalPages {
                            nextPage = gamesSearch.page + 1
                        }
                    }
                    sema.signal()
                }
            }.resume()
            sema.wait() // sets the process to wait
            result.append(contentsOf: searchResult)
            print("Request page \(page)")
            if let nextPage = nextPage {
                fetchGames(prismicRepoPrefix: prismicRepoPrefix,
                           environment: environment,
                           masterRef: validMasterRef,
                           page: nextPage,
                           result: &result)
            }
        }
    }
}

struct PrismicData {

    func exportToJsonFile(gamesData: [String : RGSCode], application: Application) {
        // Convert gamesData to have sorted codes
        let sortedGamesData: [String: GameWithSortedCode] = gamesData.mapValues { game in
            game.sorted()
        }

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .prettyPrinted]
        do {
            let data = try encoder.encode(sortedGamesData)
            let jsonString = String(data: data, encoding: .utf8)!

            try jsonString.write(
                toFile: "\(BaseDir.path)/../temp/prismic/\(application).json",
                atomically: true,
                encoding: .utf8
            )
        } catch {
           print("Error writing: \(error)")
        }
    }

    func getPrismicDataFor(application: Application, environment: Environment?) -> [String: RGSCode] {
        let prismicService = PrismicGameService()
        let applicationConfig = ApplicationConfig(application: application, environment: environment)
        var allRawGames: [Game] = []
        var allRGSCodes: [String: RGSCode] = [:]

        // Retrieving the data from prismic for all teh prismic repos configured
        // for the current application into a single list
        for prismicJurisdictions in applicationConfig.jurisdictions {
            for env in applicationConfig.environments {
                print("Retrieving games for \(env):\(prismicJurisdictions) - prismic repo \(prismicJurisdictions.rawValue)\(env.rawValue)")
                prismicService.fetchGames(prismicRepoPrefix: prismicJurisdictions,
                                          environment: env,
                                          result: &allRawGames)
            }
        }

        // Transform the data retrieved from prismic into a dictionary
        for game in allRawGames {
            if let rgsCodeMobile = game.rgsCodeMobile,
                let internalCode = game.internalCode,
                let displayName = game.displayName,
                let provider = game.provider {
                if let _ = allRGSCodes[rgsCodeMobile] {
                    allRGSCodes[rgsCodeMobile]?.internalCode.insert(internalCode)
                } else {
                    allRGSCodes[rgsCodeMobile] = RGSCode(internalCode: [internalCode], displayName: displayName, provider: provider)
                }
            }
        }
        return allRGSCodes
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

        if argument.hasPrefix("--env=") {
            let environmentValue = String(argument.dropFirst(6))
            switch environmentValue {
            case "dev":
                options.env = .dev
            case "prod":
                options.env = .prod
            default:
                print("Invalid value provided for the --env flag, use one of the following values: dev or prod")
                break
            }
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

    let prismicData = PrismicData()

    for application in scriptOptions.apps {
       print("=======================================================================================================")
       print("Collecting data for \(application):\(application.rawValue)")

        let allPrismicRGSCodes = prismicData.getPrismicDataFor(application: application,
                                                               environment: scriptOptions.env)
        prismicData.exportToJsonFile(gamesData: allPrismicRGSCodes, application: application)
    }
}
