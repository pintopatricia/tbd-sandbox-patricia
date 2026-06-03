#import "RCTCustomUserAgent.h"
#import "PaddyPower-Swift.h"

@implementation RCTCustomUserAgent

  // To export a module named CustomUserAgent
  RCT_EXPORT_MODULE();

  RCT_EXPORT_METHOD(getFrameworkVersion:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
    resolve([Settings getGamesFrameworkVersion]);
  }

  RCT_EXPORT_METHOD(getResourcesVersion:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
    resolve([Settings gamingSettingsConfigValueFor: @"ResourcesVersion"]);
  }

  RCT_EXPORT_METHOD(registerCustomUserAgent: (NSString *)customUserAgent) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [Settings setCustomUserAgent: customUserAgent];
    });
  }
@end
