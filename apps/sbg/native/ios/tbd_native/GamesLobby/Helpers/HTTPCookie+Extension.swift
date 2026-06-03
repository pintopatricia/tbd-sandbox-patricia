import Foundation

extension HTTPCookie {

  /// create a JavaScript presentation of the current cookie. Useful when you want to inject the cookie into a WebView
  ///
  /// - Returns: Returns the JavaScript representation of the cookie as a string value.
  func createCookieJSRepresentation() -> String {
    var cookieBody = "\(self.name)=\(self.value); " + "domain=\(self.domain); " + "path=\(self.path);"
    if let date = self.expiresDate {
      cookieBody += " expires=\(ISO8601DateFormatter().string(from: date))"
    }
    return "document.cookie = '\(cookieBody)';"
  }
}
