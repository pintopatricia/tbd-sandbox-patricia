//
//  RCTShortcutModule.m
//  tbd_native
//
//  Created by Andy Lawler on 24/07/2025.
//

#import <UIKit/UIKit.h>
#import <React/RCTLinkingManager.h>
#import "RCTShortcutModule.h"

@implementation RCTShortcutModule

RCT_EXPORT_MODULE();

static NSString *shortcutURL = nil;

/// `urlFromShortcutItem` is a method which takes a `UIApplicationShortcutItem` and extracts and returns a valid `NSURL` from it.
/// - Parameter shortcutItem: The shortcut item we want to process.
- (NSURL *)urlFromShortcutItem:(UIApplicationShortcutItem *)shortcutItem {
  id urlValue = shortcutItem.userInfo[@"url"];
  if ([urlValue isKindOfClass:[NSString class]]) {
    NSString *urlString = (NSString *)urlValue;
    NSURL *url = [NSURL URLWithString:urlString];
    return url;
  } else {
    return nil;
  }
}

/// `extractedShortcutFromLaunchOptions` is a method which should be called from `didFinishLaunchingWithOptions` in the `AppDelegate`. This method
/// returns a `BOOl`. If the returned value is true then you should return false from within the `AppDelegate`.
/// - Parameter launchOptions: The launch options for the app.
- (void)extractShortcutFromLaunchOptions:(NSDictionary *)launchOptions {
  UIApplicationShortcutItem *shortcutItem = launchOptions[UIApplicationLaunchOptionsShortcutItemKey];
  if (shortcutItem) {
    NSURL *url = [self urlFromShortcutItem:shortcutItem];
    if (url) {
      shortcutURL = [url absoluteString];
    }
  }
}

/// `performActionForShortcutItem` is a method which is called when iOS wants to handle shortcut items. This method is our implementation which sits within the native module. You should call this from the real method implemented in the `AppDelegate`.
/// - Parameters:
///   - shortcutItem: The shortcut item which has been tapped by the user.
///   - completionHandler: The completion handler if required to say if we have handled the item successfully.
- (void)performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem
                  completionHandler:(void (^)(BOOL succeeded))completionHandler
{
    NSURL *url = [self urlFromShortcutItem:shortcutItem];
    if (url) {
        [RCTLinkingManager application:[UIApplication sharedApplication] openURL:url options:@{}];
        if (completionHandler) {
            completionHandler(YES);
        }
        return;
    }
    if (completionHandler) {
        completionHandler(NO);
    }
}

/// `getShortcut` is a method which can be called from within React Native. This method returns the `shortcutURL` which was set prior by `extractedShortcutFromLaunchOptions`. This method should be called on start-up of your React Native app to ensure any initial shortcuts are processed.
/// - Parameter reject: The reject block if needed.
RCT_EXPORT_METHOD(getShortcut:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (shortcutURL) {
    resolve(shortcutURL);
    shortcutURL = nil;
  } else {
    resolve([NSNull null]);
  }
}

@end
