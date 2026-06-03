import UIKit
import Foundation
import GamesFramework

/// An enumeration for the various screens names supported by the GamesLobbyView.
enum GamingScreenNames: String {
  case lobby = "GamingLobbyScreen"
  case gameCollection = "GamingGamesCollectionScreen"
  case subGameCollection = "GamingSubGamesCollectionScreen"
  case mySelections = "GamingMySelectionsScreen"
  case webView = "GamingWebViewScreen"
}

@objc(GamesLobbyView)
class GamesLobbyView: UIView {

  override init(frame: CGRect) {
    super.init(frame: frame)

    /// Subscribe to refresh jackpot values
    NotificationCenter.default.addObserver(forName: UIApplication.willEnterForegroundNotification , object: nil, queue: nil) { _ in
      Task { @MainActor in
        GamesLobbyView.gamesFramework?.reloadData(shouldCancelReload: true)
      }
    }
    /// Subscribe to the mySelectionsDidDismiss notification
    NotificationCenter.default.addObserver(forName: .mySelectionsDidDismiss, object: nil, queue: nil) { [weak self] _ in
      Task { @MainActor [weak self] in
        guard let self = self else { return }

        // Send the onDismissMySelectionsScreen event to React Native only when the screen is mySelections
        //  or else it will pop the wrong screen from navigation stack
        if self.screen == .mySelections {
          GamesLobbyEventEmitter.sendEvent(withName: "onDismissMySelectionsScreen")
        }
      }
    }
  }

  deinit {
    // Clean-up all strong references to the ViewController that is de-initialized. If we don't do this
    //  the objects remain attached but never reused and also might generate some GamesFramework
    //  dataSource reload issues
    switch screen {
    case .gameCollection:
      GamesLobbyView.gamesCollectionViewController?.view.removeFromSuperview()
      GamesLobbyView.gamesCollectionViewController?.removeFromParent()
      GamesLobbyView.gamesCollectionViewController = nil
    case .lobby:
      GamesLobbyView.lobbyViewController?.view.removeFromSuperview()
      GamesLobbyView.lobbyViewController?.removeFromParent()
      GamesLobbyView.lobbyViewController = nil
    case .mySelections:
      GamesLobbyView.mySelectionsViewController?.view.removeFromSuperview()
      GamesLobbyView.mySelectionsViewController?.removeFromParent()
      GamesLobbyView.mySelectionsViewController = nil
    case .webView:
      GamesLobbyView.webViewController?.view.removeFromSuperview()
      GamesLobbyView.webViewController?.removeFromParent()
      GamesLobbyView.webViewController = nil
    case .subGameCollection:
      GamesLobbyView.subGamesCollectionViewController?.view.removeFromSuperview()
      GamesLobbyView.subGamesCollectionViewController?.removeFromParent()
      GamesLobbyView.subGamesCollectionViewController = nil
    }
    NotificationCenter.default.removeObserver(self)
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }

  // MARK: - Properties

  @objc var triggerConfirmation: Bool = false {
    didSet {
      if let mySelectionsViewController = GamesLobbyView.mySelectionsViewController, triggerConfirmation != false {
        GamesLobbyView.gamesFramework?.openMySelectionPopUp(viewController: mySelectionsViewController)
      }
    }
  }

  @objc var gamesLobbyTabActive: Bool = true {
    didSet {
      GamesLobbyEventEmitter.sendEvent(withName: "onDismissGameDetailsScreen")
      if GamesLobbyView.lobbyViewController != nil {
        GamesLobbyView.gamesFramework?.setEnabledScrollingForCollections(gamesLobbyTabActive)
      }
    }
  }

  @objc var closeGameInfo: Bool = false {
    didSet {
      guard closeGameInfo else { return }
      Task { @MainActor in
        GamesLobbyView.gameInfoViewController?.dismiss(animated: true) {
          GamesLobbyView.gameInfoViewController = nil
        }
      }
      self.closeGameInfo = false
    }
  }
  /// Function passed to react-native to dismiss the current opened game when user taps on a game launch notification
  @objc func closeModalView(resolver: @escaping RCTPromiseResolveBlock) {
    if GamesLobbyView.gameContainerOpened {
      GamesLobbyView.gameContainerOpened = false
      GamesLobbyView.gameLaunchInfo = nil
      GamesLobbyEventEmitter.sendEvent(withName: "onDismissGameContainer")
      Orientation.setOrientation(AppSupportedOrientations.applicationDefaultOrientations)
      GamesLobbyView.postLoginCallback = nil
      DispatchQueue.main.async {
        GamesLobbyView.presentedViewController?.dismiss(animated: true) {
          resolver(nil)
        }
      }
    } else {
      if (GamesLobbyView.presentedViewController != nil) {
        DispatchQueue.main.async {
          GamesLobbyView.presentedViewController?.dismiss(animated: true) {
            resolver(nil)
          }
        }
      } else {
        resolver(nil)
      }
    }
  }
  /// Function passed to react-native to trigger the in-page Free-to-Play close button,
  /// ensuring any in-game audio/video is stopped, and removes the WebViewController from the navigation stack.
  @objc func stopFTPSound(_ resolver: @escaping RCTPromiseResolveBlock,
                             rejecter: @escaping RCTPromiseRejectBlock) {
      guard let webVC = GamesLobbyView.webViewController as? WebViewController else {
          resolver(nil)
          return
      }

      let closeJS = """
      (function() {
          try {
              const closeButton = document.querySelector('.free-to-play-container [data-qa="soundButton"]');
              if(closeButton) { closeButton.click(); }
          } catch(e) {
              console.error(e);
          }
      })();
      """

      DispatchQueue.main.async {
          webVC.webKitView?.evaluateJavaScript(closeJS) { _, error in
              if let error = error {
                  print("Error stopping media or clicking close: \(error)")
              }
          }
       }
  }
  

  /// A dictionary of string keys and String or Bool values. This is set from React Native.
  ///
  /// When this is set it will decode the values in to a DynamicFrameworkConfiguration value and it will trigger an
  /// update of the games framework configuration.
  @objc var configs: [String: Any] = [:] {
    didSet {
      let dynamicConfigs = DynamicFrameworkConfiguration(dictionary: configs)
      screen = GamingScreenNames(rawValue: dynamicConfigs.screen) ?? .lobby
      GamesLobbyView.shared.screen = screen
      
      if (GamesLobbyView.gameLaunchInfo != dynamicConfigs.gameLaunchInfo) {
        GamesLobbyView.gameLaunchInfo = dynamicConfigs.gameLaunchInfo
        self.setNeedsLayout()
        self.layoutIfNeeded()
      }
      
      GamesLobbyView.otpConsent = dynamicConfigs.otpConsent
      GamesLobbyView.gameEnvironment = dynamicConfigs.environment
      GoogleTagTracker.sharedInstance.userConsent = dynamicConfigs.performanceCookiesStatus
      updateFrameworkConfiguration(configs: dynamicConfigs)
      if GamesLobbyView.gamesFramework?.ssoid != nil {
        GamesLobbyView.postLoginCallback?()
        GamesLobbyView.postLoginCallback = nil
        GamesLobbyView.ssoidSetCallback?()
      }
      GamesLobbyView.loginScreenAppeared = false
      resolveDeeplinkIfNeeded()
    }
  }

  private var screen: GamingScreenNames = .lobby
  private static var deepLinkUrl: String? = nil
  private static var deepLinkUrn: String? = nil
  private static var gameLaunchInfo: GameLaunchInfo? = nil
  private static var gameContainerOpened: Bool = false
  private static var gameEnvironment: String = ""
  private static var delayedDeepLinkUrnAction: (() -> Void)? = nil
  private static var otpConsent: String? = nil

  func updateFrameworkConfiguration(configs: DynamicFrameworkConfiguration) {
    // Create the GamesFramework instance if it wasn't been done yet
    if GamesLobbyView.gamesFramework == nil {
        GamesLobbyView.gamesFramework = GamesFramework.createDefaultInstance(configs: configs)
    }
    GamesLobbyView.gamesFramework?.updateConfiguration(configs: configs)
  }

  func resetDeeplink() {
    if Self.deepLinkUrl != nil {
      Self.deepLinkUrl = nil
    }
    if Self.deepLinkUrn != nil {
           Self.deepLinkUrn = nil
         }
  }

  static let shared = GamesLobbyView()
  /// callback used to execute and action after the user login
  private static var postLoginCallback: (() -> Void)?
  private static var loginScreenAppeared: Bool?
  private static var gamesDidLoad: Bool = false

  /// callback used to execute and action after the ssoid is set
  private static var ssoidSetCallback: (() -> Void)?

  // MARK: - Class View Controllers

  /// The parent view controller, that will present the gaming view controllers
  static var _parentVC: UIViewController?

  /// The main view controller. This will be the first screen that will be presented (if the on boarding is not presented)
  static var lobbyViewController: UIViewController?
  
  static var presentedViewController: UIViewController?
  
  /// The view controller with details for a game, is shown on top of games or lobby view controller
  static var gameDetailsViewController: UIViewController?

  /// The view controller containing a collection of games based on a tag. During an user session this may change
  /// depending of the tag the user selected.
  static var gamesCollectionViewController: UIViewController?

  /// The view controller containing a sub collection of games  based on a sub-category tag. During an user session this may change
  /// depending of the tag the user selected.
  static var subGamesCollectionViewController: UIViewController?

  /// The view controller with the user selected tags for game collections.
  static var mySelectionsViewController: UIViewController?

  /// The view controller with the user selected tags for game collections.
  static var webViewController: UIViewController?

  /// The view controller with a collection of elements containing game details (Game Info)
  static var gameInfoViewController: UIViewController?

  // MARK: - Games Framework init

  /// The GamesFramework instance. This is a static variable because we don't want to create a new framework
  /// instance every time a new GamesLobbyView screen is created. When this is set then configured
  static var gamesFramework: GamesFramework? {
    didSet {
      guard let framework = GamesLobbyView.gamesFramework else { return }

      /// Add RemoteLogs delegate in order that GamesFramework be able to log errors or crashes to Firebase Crashlytics
      framework.remoteLogDelegate = RemoteLogs.shared
      framework.trackingEventsDelegate = GoogleTagTracker.sharedInstance

      framework.onViewControllerWillChange = { (viewController, segue, backNavigationTitle) in
        viewController.definesPresentationContext = true
        
        switch segue {
        case .showWebView:
          var isSuperSpinsUrl = false
          if let webVC = viewController as? WebViewController,
             let urlString = webVC.contentUrl?.absoluteString.lowercased() {
                isSuperSpinsUrl = urlString.contains("free-to-play") || urlString.contains("super-spins")
          }
                  
          let eventBodyObject: [String: Any] = ["backNavigationTitle": backNavigationTitle ?? "", "isSuperSpinsUrl": isSuperSpinsUrl]
          GamesLobbyView.webViewController = viewController
          GamesLobbyEventEmitter.sendEvent(withName: "onShowWebView", body: eventBodyObject)
          
        case .showGamesCollection:
          GamesLobbyView.onOpenGameCollectionScreen(with: viewController)
        default:
          _parentVC?.present(viewController, animated: true, completion: nil)
        }
      }

      // This callback is implemented in order to handle the ssoID required by the games framework.
      // If the ssoId is required but is nil then the `onSSOIDRequired` event is sent to
      // React Native in order to obtain a valid ssoId value.
      framework.onSSOIDRequired = { isTokenMandatory, ssoCallback in
        if isTokenMandatory && GamesLobbyView.gamesFramework?.ssoid == nil {
        authenticatedAction {
              if let ssoid = GamesLobbyView.gamesFramework?.ssoid {
                  ssoCallback(ssoid)
              }
          }
        } else {
          ssoCallback(GamesLobbyView.gamesFramework?.ssoid)
        }
      }

      // This callback is implemented in order to handle invalid values for ssoID. When this callback
      // is called we we remove the invalid ssoID value from the gamesFramework instance and also send
      // a `onNeedsAppLogout` event to React Native in order also  to request a logout.
      framework.unathorizedErrorCallback = {
        GamesLobbyView.gamesFramework?.ssoid = nil
        GamesLobbyEventEmitter.sendEvent(withName: "onNeedsAppLogout")
      }

      /// This callback is implemented in order to handle the closing of a GameContainer -> clean up game launch data and
      /// trigger a `onDismissGameContainer` to RN in order to clean up the gameLaunchDetails from the CETContext
      framework.willDismissGameContainer = {
        GamesLobbyView.gameContainerOpened = false
        GamesLobbyView.gameLaunchInfo = nil
        GamesLobbyEventEmitter.sendEvent(withName: "onDismissGameContainer")
        if let viewController = GamesLobbyView.lobbyViewController {
          viewController.view.isUserInteractionEnabled = true
        }
        Orientation.setOrientation(AppSupportedOrientations.applicationDefaultOrientations)
        GamesLobbyView.postLoginCallback = nil
      }

      /// This callback is implemented in order to handle the opening of a GameContainer
      framework.didOpenGameContainer = {
        GamesLobbyView.gameContainerOpened = true
        Orientation.setOrientation(AppSupportedOrientations.gamesOrientations)
      }

      // This callback is implemented in order to handle an user logout requested by the games framework.
      // A possible logout can be triggered by the user form the `My Account` page inside the game window.
      // This is done by sending the `onNeedsAppLogout` event to React Native in order also  to request a logout.
      framework.onNeedsAppLogout = {
        GamesLobbyEventEmitter.sendEvent(withName: "onNeedsAppLogout")
      }

      // This callback is implemented in order to to provider custom handling for the possible
      // actions on the game details view controller.
      framework.onGameDetailsEvent = { event, viewController, completion in
        switch event {
        case .show:
          if let currentViewController = _parentVC {
            if loginScreenAppeared == true {
              return
            }
            GamesLobbyView.gameInfoViewController = viewController
            currentViewController.present(viewController, animated: true, completion: completion)
            GamesLobbyEventEmitter.sendEvent(withName: "onOpenGameDetailsScreen")
          }
        case .close, .viewWillDisappear:
          viewController.dismiss(animated: true, completion: completion)
          GamesLobbyView.gameInfoViewController = nil
          GamesLobbyEventEmitter.sendEvent(withName: "onDismissGameDetailsScreen")
          break
        case .demo, .playNow:
          if loginScreenAppeared == true {
            return
          }
          viewController.dismiss(animated: true, completion: completion)
          GamesLobbyView.gameInfoViewController = nil
          break
        case .viewWillAppear:
          break
        default:
          break
        }
      }

      // This callback is implemented in order to pass the handling of the navigation to the Games Collection
      // screens by the React Native. This is done by sending the `onOpenGameCollectionScreen` event to React Native
      framework.gamesCollectionOpenedCallback = { viewController in
        if GamesLobbyView.shared.screen == .gameCollection {
                  if let oldVc = GamesLobbyView.gamesCollectionViewController {
                    oldVc.willMove(toParent: nil)
                    oldVc.view.removeFromSuperview()
                    oldVc.removeFromParent()
                  }
                }
        onOpenGameCollectionScreen(with: viewController)
      }

      // This callback is implemented in order to pass the handling of the navigation to the MySelections
      // screen by the React Native. This is done by sending the `onOpenMySelectionsScreen` event to React Native
      framework.mySelectionsOpenedCallback = { viewController in
        GamesLobbyView.mySelectionsViewController = viewController
        GamesLobbyEventEmitter.sendEvent(withName: "onOpenMySelectionsScreen")
      }

      // This callback is implemented in order to pass the handling of naviation to the Games Sub Collection of a collection
      // screen by the React Native. This is done by sending the 'onOpenSubGameCollectionScreen' event to React Native
      framework.subGamesCollectionOpenedCallback = { viewController in
        GamesLobbyView.subGamesCollectionViewController = viewController
        GamesLobbyEventEmitter.sendEvent(withName: "onOpenSubGameCollectionScreen")
      }

      // This callback is implemented in order to handle the close of the MySelections screen. Because the
      // navigation to the MySelection screen open is handled by the React Native we need to handle also the
      // dismiss of the screen there.
      framework.mySelectionsDismissCallback = { _ in
        // Triggered mySelectionsDidDismiss notification instead of sending the `onDismissMySelectionsScreen`
        // event to React Native in order to not pop other screens from the navigation.
        NotificationCenter.default.post(name: .mySelectionsDidDismiss, object: nil)
      }

      //This callback is called to handle the press of Privacy Preference Center
      framework.showPreferenceCenterAction = {
        GamesLobbyEventEmitter.sendEvent(withName: "onOpenPreferenceCenter")

      }

      /// This callback is called to handle back action from WebViewController which is sent as Parameter
      framework.goToNativeAction = {[self] webController in
        webController?.navigationController?.popViewController(animated: true)
          if let vc = webController as? WebViewController {
           if let urn = vc.nativePageToOpen {
            self.shared.navigateToDeeplinkUrn(urn: urn)
          }
        }
      }

      framework.onScrollHeaderThresholdReached = { offset  in
        GamesLobbyEventEmitter.sendEvent(withName: "onScrollHeaderThresholdReached", body: ["offset": offset])
      }
      /// This callback is called when a WebView is initialized to retrieve the OneTrust user consent as JavaScript in order to inject it before the WebViews loads an URL
      framework.onInjectOneTrustConsentAsJavascript = {
        if let otpConsentString = GamesLobbyView.otpConsent {
            return otpConsentString
        }
        return ""
      }
      
      framework.onReloadCompletedEvent = { _ in
        // delayed because we need games list loaded
        GamesLobbyView.delayedDeepLinkUrnAction?()
        GamesLobbyView.delayedDeepLinkUrnAction = nil
      }
    }
  }

  // MARK: - update layout functions

  private class  func authenticatedAction(_ callback: @escaping () -> Void ) {
    if GamesLobbyView.gamesFramework?.ssoid != nil {
      callback()
    } else {
      postLoginCallback = callback
      loginScreenAppeared = true
      GamesLobbyEventEmitter.sendEvent(withName: "onSSOIDRequired")
    }
  }

  override public func layoutSubviews() {
    super.layoutSubviews()

    loadViewController()
  }

  /// Load the appropriate ViewController based on values of the screen and gameLaunchInfo properties
  private func loadViewController() {
    // obtain and save the Parent ViewController - the view controller that will receive the current gaming screen to load
    guard let parentViewController = parentViewController else { return }
    GamesLobbyView._parentVC = parentViewController

    // Obtain the ViewController of the screen to be loaded
    var viewController: UIViewController?

    switch screen {
    case .gameCollection:
      viewController = GamesLobbyView.gamesCollectionViewController
      resetDeeplink()
    case .lobby:
      viewController = GamesLobbyView.lobbyViewController
    case .mySelections:
      viewController = GamesLobbyView.mySelectionsViewController
    case .webView:
      viewController = GamesLobbyView.webViewController
      resetDeeplink()
    case .subGameCollection:
      viewController = GamesLobbyView.subGamesCollectionViewController
    }

    if viewController == nil {
      viewController = GamesLobbyView.gamesFramework!.buildGamesViewController()!
      GamesLobbyView.lobbyViewController = viewController
    }

    // present the view controller
    if let viewController = viewController {
      GamesLobbyView.presentedViewController = viewController
      presentViewController(viewController)
      if !GamesLobbyView.gameContainerOpened, screen == .lobby {
          func launchGameIfNeeded() {
            guard !GamesLobbyView.gameContainerOpened, let gameLaunchInfo = GamesLobbyView.gameLaunchInfo, let gameUrl = URL(string: gameLaunchInfo.gameUrl) else {
              return
            }
            GamesLobbyView.gamesFramework?
              .launchGame(withId: gameLaunchInfo.gameId,
                          isFromCPP: false,
                          isFromWeb: true,
                          from: viewController,
                          gameUrl: gameUrl)
          }
        launchGameIfNeeded()
      }
    }
  }

  /// Present a view controller using the parentViewController the first parent UIViewController as a parent.
  ///
  /// - Parameter viewController: the view controller that will be presented
  private func presentViewController(_ viewController: UIViewController) {
    let parentView = self.next as! UIView
    self.reactSetFrame(parentView.bounds)
    viewController.view.frame = parentView.bounds
    viewController.view.translatesAutoresizingMaskIntoConstraints = false
    viewController.view.autoresizingMask = [.flexibleHeight, .flexibleWidth]
    GamesLobbyView._parentVC?.addChild(viewController)
    viewController.didMove(toParent: GamesLobbyView._parentVC)
    addSubview(viewController.view)
    viewController.view.fillSuperviewWidth()
    viewController.view.fillSuperviewHeight()
  }
  private func resolveDeeplinkIfNeeded() {
    if let deepLinkUrn = configs["deepLinkUrn"] as? String,
       Self.deepLinkUrn != deepLinkUrn {
      Self.deepLinkUrn = deepLinkUrn
      if Self.gamesFramework?.hasGames() == false {
        Self.delayedDeepLinkUrnAction = { [weak self] in
          self?.navigateToDeeplinkUrn(urn: deepLinkUrn)
        }
      } else {
        navigateToDeeplinkUrn(urn: deepLinkUrn)
      }
    } else if let deepLinkUrl = configs["deepLinkUrl"] as? String,
              Self.deepLinkUrl != deepLinkUrl,
              let url = URL(string: deepLinkUrl) {
      Self.deepLinkUrl = deepLinkUrl
      navigateToDeeplinkUrl(url: url)
    }
  }
  
  private func navigateToDeeplinkUrl(url: URL) {
    let webController = GamesLobbyView.gamesFramework?.buildWebViewController(configuration: .init(url: url))
    webController?.definesPresentationContext = true
      if let oldVc = GamesLobbyView.webViewController {
        oldVc.willMove(toParent: nil)
        oldVc.view.removeFromSuperview()
        oldVc.removeFromParent()
      }

    GamesLobbyView.webViewController = webController
    GamesLobbyEventEmitter.sendEvent(withName: "onShowWebView")
  }
  
  private func navigateToDeeplinkUrn(urn: String) {
    guard let collectionName = GamesLobbyView.gamesFramework?.gameCollectionName(for: urn),
          !collectionName.isEmpty else {
      return
    }
    
    if let gameDetailsVC = GamesLobbyView.gameDetailsViewController {
      GamesLobbyView.gamesFramework?.onGameDetailsEvent?(.close, gameDetailsVC, nil)
    }
    GamesLobbyView.gamesFramework?.setupGameCollectionController(with: collectionName,
                                                                 showOnlyPreselectedCollections: true,
                                                                 completion: { viewController in
      guard let viewController else { return }
      viewController.definesPresentationContext = true
      GamesLobbyView.onOpenGameCollectionScreen(with: viewController)
    })
  }
  
  static private func onOpenGameCollectionScreen(with viewController: UIViewController) {
    let eventBodyObject: [String: String] = ["backNavigationTitle": viewController.navigationItem.title ?? ""]
    GamesLobbyView.gamesCollectionViewController = viewController
    GamesLobbyEventEmitter.sendEvent(withName: "onOpenGameCollectionScreen", body: eventBodyObject)
  }
}
