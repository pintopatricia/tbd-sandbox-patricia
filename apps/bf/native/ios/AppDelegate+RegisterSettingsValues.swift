#if DEBUG || QA

import Foundation

extension AppDelegate {
    /// Initialise all of Settings Bundle default values
    func registerSettingsBundleDefaultValues() {
        Bundle.registerDefaultValuesFromSettingsBundle(forResource: "Root")
    }
}

private extension Bundle {
    /// This method will read the plist resource file, and save the "DefaultValue" in the standard UserDefaults.
    /// This method is a workaround the fact that, debug builds not always initialise the settings when first run the app.
    /// But, it's important for our app during debug the default values on the settings are taking effect.
    /// - parameter forResource: The name of the plist file inside of the Settings Bundle
    static func registerDefaultValuesFromSettingsBundle(forResource: String) {
        guard let settingBundle = Bundle.settingsBundle,
              let itemsDictionary = settingBundle.dictionary(forResource: forResource, ofType: "plist"),
              let itemsArray = itemsDictionary["PreferenceSpecifiers"] as? [[String: Any]] else {
                  return
              }
        
        let defaultValues: [String: Any] = itemsArray.reduce(into: [:]) { values, item in
            guard let key = item["Key"] as? String,
                  let defaultValue = item["DefaultValue"] else { return }
            
            values[key] = defaultValue
        }
        
        UserDefaults.standard.register(defaults: defaultValues)
    }
    
    static var settingsBundle: Bundle? {
        guard let path = main.path(forResource: "Settings", ofType: "bundle"),
              let bundle = Bundle(path: path) else { return nil }
        
        return bundle
    }
    
    func dictionary(forResource resource: String, ofType type: String) -> [String: Any]? {
        guard let path = path(forResource: resource, ofType: type) else { return nil }
        return NSDictionary(contentsOfFile: path) as? [String: Any]
    }
}

#endif
