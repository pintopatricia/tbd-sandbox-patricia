import Foundation
import GamesFramework

struct GameLaunchInfo: Equatable {
  let gameUrl: String
  let gameId: String
  let isFromCpp: Bool
}

struct DynamicFrameworkConfiguration {
  let accountID: Int
  let applicationKey: String
  let countryCode: String
  let currencyCode: String
  let environment: String
  let environmentType: String
  /// The DRK-specific header value, only used when environmentType is "drk"
  let drkHeaderValue: String?
  let assetsDomain: String
  let gameLaunchInfo: GameLaunchInfo?
  let jurisdiction: String
  let localeCode: String
  let loggedIn: Bool
  let screen: String
  let deepLinkUrn: String?
  let deepLinkUrl: String?
  let ssoId: String?
  let performanceCookiesStatus: UserConsentState
  let regulatoryUserInfo: String?
  let lastLoginDate: String?
  let walletNames: [String]
  let openedLoginScreen: Bool?
  let otpConsent: String?

  init(dictionary: [String: Any]?) {
    if let gameLaunchInfo = dictionary?["gameLaunchInfo"] as? [String: Any] {
      let gameUrl = gameLaunchInfo["gameUrl"] as? String ?? ""
      let gameId = gameLaunchInfo["gameId"] as? String ?? ""
      let isFromCpp = gameLaunchInfo["isFromCpp"] as? Bool ?? false
      self.gameLaunchInfo = GameLaunchInfo(gameUrl: gameUrl, gameId: gameId, isFromCpp: isFromCpp)
    } else {
      self.gameLaunchInfo = nil
    }
    self.accountID = dictionary?["accountId"] as? Int ?? GATrackingConstants.EventParameterValue.userId_loggedOut
    self.performanceCookiesStatus = UserConsentState(rawValue: dictionary?["performanceCookiesStatus"] as? Int ?? UserConsentState.unknown.rawValue) ?? .unknown
    self.applicationKey = dictionary?["applicationKey"] as? String ?? ""
    self.countryCode = dictionary?["countryCode"] as? String ?? ""
    self.currencyCode = dictionary?["currencyCode"] as? String ?? ""
    self.environment = dictionary?["environment"] as? String ?? ""
    self.environmentType = dictionary?["environmentType"] as? String ?? ""
    self.drkHeaderValue = dictionary?["drkHeaderValue"] as? String
    self.jurisdiction = dictionary?["jurisdiction"] as? String ?? ""
    self.localeCode = dictionary?["localeCode"] as? String ?? ""
    self.loggedIn = dictionary?["loggedIn"] as? Bool ?? false
    self.screen = dictionary?["screen"] as? String ?? ""
    self.deepLinkUrn = dictionary?["deepLinkUrn"] as? String ?? ""
    self.deepLinkUrl = dictionary?["deepLinkUrl"] as? String ?? ""
    self.ssoId = dictionary?["ssoId"] as? String
    self.regulatoryUserInfo = dictionary?["regulatoryUserInfo"] as? String ?? ""
    self.lastLoginDate = dictionary?["lastLoginDate"] as? String ?? ""
    self.walletNames = dictionary?["walletNames"] as? [String] ?? []
    self.openedLoginScreen = dictionary?["openedLoginScreen"] as? Bool ?? false
    self.otpConsent = dictionary?["otpConsent"] as? String ?? ""
    
    let environmentShort = Settings.gamingSettingsConfigValue(for: ConfigKeys.environmentShort)
    let assetsDomainShort = Settings.gamingSettingsConfigValue(for: ConfigKeys.assetsDomainShort)
    var assetsDomainValue = self.environment
    if !environmentShort.isEmpty, environmentShort != assetsDomainShort {
      assetsDomainValue = environment.replacingOccurrences(of: environmentShort, with: assetsDomainShort)
    }
    self.assetsDomain = assetsDomainValue
  }
}

extension FrameworkConfiguration {
  static func getLobbyConfiguration(configs: DynamicFrameworkConfiguration) -> FrameworkConfiguration {
    return FrameworkConfiguration(product: Settings.gamingSettingsConfigValue(for: ConfigKeys.gamesApiProductKey),
                                  regulatoryProduct: Settings.gamingSettingsConfigValue(for: ConfigKeys.regulatoryApiProductKey),
                                  bucket: Settings.gamingSettingsConfigValue(for: ConfigKeys.recentlyPlayedBucketKey),
                                  environment: configs.frameworkEnvironment,
                                  assetsDomain: configs.assetsDomain,
                                  appScheme: Settings.getUrlSchema(),
                                  subdomain: Settings.gamingSettingsConfigValue(for: ConfigKeys.subdomainKey),
                                  serviceKey: configs.applicationKey,
                                  brand: .skyBet,
                                  jurisdiction: configs.jurisdiction,
                                  countryCode: configs.countryCode,
                                  currencyCode: configs.currencyCode,
                                  language: configs.localeCode,
                                  userState: configs.loggedIn ? .loggedIn : .loggedOut,
                                  userInfo: FrameworkUserInformation(regulatoryUserInfo: configs.regulatoryUserInfo, lastLoginDate: configs.lastLoginDate),
                                  walletNames: configs.walletNames,
                                  applicationKey: Settings.gamingSettingsConfigValue(for: ConfigKeys.applicationIdKey),
                                  customUserAgent: Settings.getCustomUserAgent(),
                                  processPool: Settings.processPool,
                                  supportedOrientations: AppSupportedOrientations.applicationDefaultOrientations)
  }
}

extension ThemeConfiguration {
  static var lobbyTheme: ThemeConfiguration {
    return .skyBetGames
  }
}

extension GamesFramework {
  static func createDefaultInstance(configs: DynamicFrameworkConfiguration) -> GamesFramework {
    return GamesFramework(withConfiguration: FrameworkConfiguration.getLobbyConfiguration(configs: configs),
                          UITheme: ThemeConfiguration.lobbyTheme)
  }

  func updateConfiguration(configs: DynamicFrameworkConfiguration) {
    ssoid = configs.ssoId
    configuration = FrameworkConfiguration.getLobbyConfiguration(configs: configs)
  }
  
  func gameCollectionName(for pushNotificationUrn: String) -> String {
    switch pushNotificationUrn {
    case "gc-sportsgaming-slots", "sportsgaming-slots":
      return "Slots"
    case "gc-sportsgaming-live", "sportsgaming-live":
      return "Live"
    case "gc-sportsgaming-jackpots", "sportsgaming-jackpots":
      return "Jackpots"
    case "gc-sportsgaming-roulette", "sportsgaming-roulette":
      return "Roulette"
    case "gc-sportsgaming-blackjack", "sportsgaming-blackjack":
      return "Blackjack"
    case "gc-sportsgaming-instant-win", "sportsgaming-instant-win":
      return "Instant Win"
    case "gc-sportsgaming-slingo", "sportsgaming-slingo":
      return "Slingo"
    default: return ""
    }
  }
}
