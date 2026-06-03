#import "IFDATracking.h"

@implementation IFDATracking

  RCT_EXPORT_MODULE()

  RCT_EXPORT_METHOD(getTrackingStatus:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
  {
    if (@available(iOS 14, *)) {
      resolve([IFDATracking convertTrackingStatusToString:[ATTrackingManager trackingAuthorizationStatus]]);
    } else {
      resolve(@"unavailable");
    }
  }

  +(void) requestPermission API_AVAILABLE(ios(14)) {
      NSString *hideConsent = [[NSProcessInfo processInfo] environment][@"HIDE_CONSENT"];
      BOOL shouldHideConsent = [hideConsent isEqualToString:@"YES"];
      
      if(!shouldHideConsent){
        [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
        NSLog(@"%@", [IFDATracking convertTrackingStatusToString:status]);
        }];
      } else {
        NSLog(@"app tracking disabled based on env variable");
      }
  }

  +(NSString *) convertTrackingStatusToString:(ATTrackingManagerAuthorizationStatus) status API_AVAILABLE(ios(14)) {
    switch (status) {
        case ATTrackingManagerAuthorizationStatusAuthorized:
            return @"authorized";
        case ATTrackingManagerAuthorizationStatusDenied:
            return @"denied";
        case ATTrackingManagerAuthorizationStatusRestricted:
            return @"retricted";
        case ATTrackingManagerAuthorizationStatusNotDetermined:
            return @"not-determined";
    }
  }

@end
