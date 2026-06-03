//
//  RCTShortcutModule.h
//  tbd_native
//
//  Created by Andy Lawler on 24/07/2025.
//

#import <React/RCTBridgeModule.h>

///
/// `RCTShortcutModule` has already been used within TBD within `deep-linking` when the Platform is detected as iOS. If you wish to use Shortcuts in the future for other
/// iOS projects within TBD you must follow the steps below:
///
/// 1. Ensure you have imported the `RCTShortcutModule.h` file in your `AppDelegate.m` file and also that the `shortcutModule` property is added within an internal interface in your `AppDelegate.m` file.
///
/// #import "RCTShortcutModule.h"
///
/// @interface AppDelegate ()
/// @property (nonatomic, strong) RCTShortcutModule *shortcutModule;
/// @end
///
/// 2. Add the following code at the top of `didFinishLaunchingWithOptions` in your `AppDelegate` to ensure shortcuts which are tapped when the app is fully closed are handled.
///
/// self.shortcutModule = [RCTShortcutModule new];
/// [self.shortcutModule extractShortcutFromLaunchOptions:launchOptions]
///
/// 3. Add the following code at the bottom of your `AppDelegate` to ensure you have a `shortcutModule` to access and to ensure your app handles shortcuts while the apps backgrounded.
///
///- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded))completionHandler
///{
///    [self.shortcutModule performActionForShortcutItem:shortcutItem completionHandler:completionHandler];
///}

@interface RCTShortcutModule : NSObject <RCTBridgeModule>

- (void)extractShortcutFromLaunchOptions:(NSDictionary *)launchOptions;
- (void)performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded))completionHandler;

@end
