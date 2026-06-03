import GamesFramework
import Foundation
import WebKit

/// An collection of keys for which we can obtain values from a Info.plist file.
enum ConfigKeys {
  static let buildNumberKey               = "CFBundleVersion"
  static let bundleIdentifierKey          = "CFBundleIdentifier"
  static let bundleNameKey                = "CFBundleName"
  static let bundleShortVersionStringKey  = "CFBundleShortVersionString"
  static let bundleURLNameKey             = "CFBundleURLName"
  static let bundleURLSchemesKey          = "CFBundleURLSchemes"
  static let urlTypesKey                  = "CFBundleURLTypes"

  static let SupportedInterfaceOrientationsKey  = "UISupportedInterfaceOrientations"

  static let plistSettingsKey             = "GamingSettings"
  static let applicationIdKey             = "applicationId"
  static let gamesApiProductKey           = "GamesApiProduct"
  static let recentlyPlayedBucketKey      = "RecentlyPlayedBucket"
  static let regulatoryApiProductKey      = "RegulatoryApiProduct"
  static let resourcesVersionKey          = "ResourcesVersion"
  static let subdomainKey                 = "SubDomain"
  static let environmentShort             = "EnvironmentShort"
  static let assetsDomainShort            = "AssetsDomainShort"
}

/// Helper class containing methods to extract different information about the current app configs.
@objc class Settings: NSObject {
  @objc static let processPool: WKProcessPool = WKProcessPool()

  @objc private static var _customUserAgent: String = ""

  @objc static func setCustomUserAgent(_ userAgent: String) {
    _customUserAgent = userAgent
  }

  @objc static func getCustomUserAgent() -> String? {
    return _customUserAgent.isEmpty ? nil : _customUserAgent
  }

  /// Extract and return the version for a framework
  ///
  /// - Returns: Returns the version for the searched bundle identifier or empty String if it is not found.
  @objc static func getGamesFrameworkVersion() -> String {
    return GamesFrameworkInfo.version
  }

  /// Attempt to extract and return a config value from Info.plist based on a key
  ///
  /// - Parameter key: The key to look for in the Info.plist file
  /// - Returns: Returns the value for that key or an empty string in case it is not found.
  static func configValue(for key: String) -> String {
      return Bundle.main.object(forInfoDictionaryKey: key) as? String ?? ""
  }

  /// Attempt to extract and return a config value from Info.plist based on a key
  ///
  /// - Parameter key: The key to look for in the Info.plist file
  /// - Returns: Returns the value for that key or an empty string in case it is not found.
  static func configValue(for key: String) -> [String] {
      return Bundle.main.object(forInfoDictionaryKey: key) as? [String] ?? []
  }

  /// Attempt to extract and return a config value as String from the GamingSetting dictionary from Info.plist
  ///
  /// - Parameter key: The key to look for in the GamingSettings Dictionary from Info.plist file
  /// - Returns: Returns the value for that key or an empty string in case it is not found.
  @objc static func gamingSettingsConfigValue(for key: String) -> String {
    let settings = Bundle.main.object(forInfoDictionaryKey: ConfigKeys.plistSettingsKey) as? [String : AnyObject]
    return settings?[key] as? String ?? ""
  }

  /// Attempt to extract and return a config value as Bool from the GamingSetting dictionary from Info.plist
  ///
  /// - Parameter key: The key to look for in the GamingSettings Dictionary from Info.plist file
  /// - Returns: Returns the value for that key or false in case it is not found.
  @objc static func gamingSettingsConfigValueBool(for key: String) -> Bool {
    let settings = Bundle.main.object(forInfoDictionaryKey: ConfigKeys.plistSettingsKey) as? [String : AnyObject]
    return settings?[key] as? Bool ?? false
  }

  /// Attempt to extract and return the app URL Schema
  ///
  /// - Returns: Searches the Info.plist file for the  URL Schema of the current app bundle identifier and return it or and empty String if it is not found.
  static func getUrlSchema() -> String {
    if let urlTypes = Bundle.main.object(forInfoDictionaryKey: ConfigKeys.urlTypesKey) as? [[String: AnyObject]] {
      let bundleIdentifier: String = Settings.configValue(for: ConfigKeys.bundleIdentifierKey)

      for urlType in urlTypes {
        if let bundleURLName = urlType[ConfigKeys.bundleURLNameKey] as? String,
           bundleURLName == bundleIdentifier,
           let bundleURLSchemes = urlType[ConfigKeys.bundleURLSchemesKey] as? [String],
           let bundleURLScheme = bundleURLSchemes.first {
            return bundleURLScheme
        }
      }
    }
    return ""
  }

  /// Attempt to retrieve a cookie from HTTPCookieStorage using the cookie name
  ///
  /// - Parameter name: the cookie name
  /// - Returns: Returns the cookie from HTTPCookieStorage or nil if it is not found
  static func getCookie(name: String) -> HTTPCookie? {
    let cookies = HTTPCookieStorage.shared.cookies ?? []
    for cookie in cookies where cookie.name == name {
      return cookie
    }
    return nil
  }

  /// Attempt to retrieve a cookie from HTTPCookieStorage using the cookie name and domain. Domain check is performed if there are several cookies with same name
  ///
  /// - Parameter name: the cookie name
  /// - Parameter domainIfSeveralCookiesWithSameName: domain string that we check if there are several cookies with same name
  /// - Returns: Returns the cookie from HTTPCookieStorage or nil if it is not found
  static func getCookie(name: String, domainIfSeveralCookiesWithSameName domain: String) -> HTTPCookie? {
    let cookies = HTTPCookieStorage.shared.cookies ?? []
    let resultCookies = cookies.filter({ $0.name == name })
    if resultCookies.count > 1 {
        // we don't check domain with == because for different apps might have or not have "." in the beginning
        return resultCookies.first { $0.domain.hasSuffix(domain) }
    } else {
        return resultCookies.first
    }
  }
}
