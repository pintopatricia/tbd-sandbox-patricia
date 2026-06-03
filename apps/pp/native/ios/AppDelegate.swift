import UIKit
import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import AEPCore
import AEPCampaignClassic
import RNBootSplash
import RNNotifications
import FirebaseCore

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // React Native factory setup
    let delegate = TBDReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

    #if DEBUG || QA
      var args = ProcessInfo.processInfo.arguments
      args.append("-FIRAnalyticsDebugEnabled")
      args.append("-FIRDebugEnabled")
      ProcessInfo.processInfo.setValue(args, forKey: "arguments")
      UserDefaults.standard.set(true, forKey: "/google/firebase/debug_mode")
      UserDefaults.standard.set(true, forKey: "/google/measurement/debug_mode")
    #endif
    FirebaseApp.configure()

    #if DEBUG || QA
      registerSettingsBundleDefaultValues()
    #endif

    MobileCore.registerExtensions([CampaignClassic.self]) {
      MobileCore.lifecycleStart(additionalContextData: nil)
    }
    RNNotifications.startMonitorNotifications()
    UNUserNotificationCenter.current().delegate = self
    Orientation.setOrientation(AppSupportedOrientations.applicationDefaultOrientations)

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "tbd_native",
      in: window,
      launchOptions: launchOptions
    )

    // Forwards to ExpoAppDelegateSubscriberRepository.subscribers — preserves
    // any expo modules that register lifecycle callbacks
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func applicationDidBecomeActive(_ application: UIApplication) {
    super.applicationDidBecomeActive(application)
    IFDATracking.requestPermission()
  }

  override func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if super.application(app, open: url, options: options) {
      return true
    }

    return RCTLinkingManager.application(app, open: url, options: options)
  }

  override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    if super.application(application, continue: userActivity, restorationHandler: restorationHandler) {
      return true
    }

    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }

  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    RNNotifications.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  }

  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
    RNNotifications.didFailToRegisterForRemoteNotificationsWithError(error)
  }

  override func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    RNNotifications.didReceiveBackgroundNotification(
      userInfo,
      withCompletionHandler: completionHandler
    )
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                               didReceive response: UNNotificationResponse,
                               withCompletionHandler completionHandler: @escaping () -> Void) {
    RNNotifications.sharedInstance().multicast().userNotificationCenter(center,
                                                                        didReceive: response,
                                                                        withCompletionHandler: completionHandler)
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    RNNotifications.sharedInstance().multicast().userNotificationCenter(center,
                                                                        willPresent: notification,
                                                                        withCompletionHandler: completionHandler)
    completionHandler([.sound, .list, .banner, .badge])
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              openSettingsFor notification: UNNotification?) {
    RNNotifications.sharedInstance().multicast().userNotificationCenter(center,
                                                                        openSettingsFor: notification)
  }
}

// ExpoUpdatesReactDelegateHandler overrides `bundleURL`
// upstream when an OTA update is available. Otherwise falls back to embedded bundle
class TBDReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  override func customize(_ rootView: UIView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("LaunchScreen", rootView: rootView)
  }
}

// Expo SDK 53's bare-RN AppDelegate template calls `factory.startReactNative`,
// but that method was only added to `RCTReactNativeFactory` in React Native 0.79.
// thus the polyfill replicating as close as possible
// can be deleted on RN 0.79+ to use the built-in `startReactNative` instead
extension RCTReactNativeFactory {
  func startReactNative(
    withModuleName moduleName: String,
    in window: UIWindow?,
    initialProperties: [AnyHashable: Any]? = nil,
    launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) {
    let rootView = rootViewFactory.view(
      withModuleName: moduleName,
      initialProperties: initialProperties,
      launchOptions: launchOptions
    )
    let rootViewController = delegate?.createRootViewController() ?? UIViewController()
    if let delegate = delegate {
      delegate.setRootView(rootView, toRootViewController: rootViewController)
    } else {
      rootViewController.view = rootView
    }
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()
  }
}
