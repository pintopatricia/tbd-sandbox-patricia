//  TBDPerformanceModule.h
#import <React/RCTBridgeModule.h>
#import <Firebase/Firebase.h>

@interface TBDPerformanceModule : NSObject <RCTBridgeModule>

+(void) stopUIFpsTracking;

@end
