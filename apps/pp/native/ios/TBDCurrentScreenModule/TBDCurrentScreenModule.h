//  TBDCurrentScreenModule.h
#import <React/RCTBridgeModule.h>

@interface TBDCurrentScreenModule : NSObject <RCTBridgeModule>

+(NSString *)getCurrentScreenStatic;
-(void)setCurrentScreen:(NSString *)screenName;
@end
