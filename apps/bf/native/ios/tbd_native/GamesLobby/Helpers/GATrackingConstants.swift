import Foundation

class GATrackingConstants {
    struct EventParameterKey {
        static let event                = "event"
        // Global dimensions
        static let account_id           = "account_id"
        static let vertical             = "vertical"
        static let locale               = "locale"
        static let product              = "product"
        static let login_status         = "login_status"
        static let jurisdiction         = "jurisdiction"
        static let country              = "country"
        static let app_id               = "app_id"
        static let orientation          = "orientation"
        static let brand                = "brand"
        static let oddsDisplay          = "oddsDisplay"
    }

    struct EventParameterValue {
        static let userId_loggedOut     = 123456
        static let product              = "app"
        static let vertical             = "rebuild"
        static let loggedIn             = "logged in"
        static let loggedOut            = "logged out"
        static let betfair              = "bf"
        static let decimal              = "decimal"
        static let fractional           = "fractional"
        static let event                = "event"
    }
}

enum UserConsentState: Int, Sendable {
    case unknown = -1
    case denied = 0
    case accepted = 1
}
