#import "TMXModule.h"
#import <TMXProfiling/TMXProfiling.h>
#import <TMXProfilingConnections/TMXProfilingConnections.h>

typedef NS_ENUM(NSInteger, Brand) {
  BrandBetfair,
  BrandBeteasy,
  BrandSkybet
};

@implementation TMXModule

RCT_EXPORT_MODULE()

- (NSDictionary *)configForBrandString:(NSString *)brandString {
  static NSDictionary<NSString *, NSDictionary *> *brandConfigs;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    brandConfigs = @{
      @"betfair": @{
        @"orgID": @"9ghwyvdk",
        @"fingerprintServer": @"regstat.betfair.com",
        @"brand": @(BrandBetfair)
      },
      @"skybet": @{
        @"orgID": @"94b5bk32",
        @"fingerprintServer": @"regstat.skybet.com",
        @"brand": @(BrandSkybet)
      }
    };
  });
  
  NSString *lowercaseBrand = [brandString lowercaseString];
  return brandConfigs[lowercaseBrand] ?: brandConfigs[@"betfair"]; // Default to betfair
}

RCT_EXPORT_METHOD(profileDevice:(NSString *)strDevice
                  brand:(NSString *)brand
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  TMXProfilingConnections *tcn = [[TMXProfilingConnections alloc] init];
  tcn.connectionTimeout = 20;
  
  NSDictionary *brandConfig = [self configForBrandString:brand];
  
  NSArray *custAttrs = @[
    @"React Native TMX libs 8.0",
    strDevice ?: @"",
    [NSBundle mainBundle].bundleIdentifier ?: @"",
    brand
  ];
  
  [[TMXProfiling sharedInstance] configure:@{
    TMXOrgID: brandConfig[@"orgID"],
    TMXFingerprintServer: brandConfig[@"fingerprintServer"],
    TMXProfilingConnectionsInstance: tcn
  }];
  
  [[TMXProfiling sharedInstance] profileDeviceUsing:@{
    TMXCustomAttributes: custAttrs
  } callbackBlock:^(NSDictionary * _Nullable result) {
    NSLog(@"[TMX] Profiling finished for brand %@ with result: %@", brand, result);
    
    if (result) {
      resolve(result);
    } else {
      NSError *error = [NSError errorWithDomain:@"TMXError" code:500 userInfo:nil];
      reject(@"profiling_failed", @"Profiling failed", error);
    }
  }];
}

@end
