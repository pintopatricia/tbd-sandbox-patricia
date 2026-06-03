#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

NS_ASSUME_NONNULL_BEGIN

@interface IFDATracking : NSObject <RCTBridgeModule>
  +(void) requestPermission API_AVAILABLE(ios(14));
  +(NSString *) convertTrackingStatusToString:(ATTrackingManagerAuthorizationStatus) status API_AVAILABLE(ios(14));
@end

NS_ASSUME_NONNULL_END

