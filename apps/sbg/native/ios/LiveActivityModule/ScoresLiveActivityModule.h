//
//  ScoresLiveActivityModule.h
//  tbd_native
//
//  Created by Pedro Silva on 17/02/2026.
//

#ifndef ScoresLiveActivityModule_h
#define ScoresLiveActivityModule_h
#import <React/RCTBridgeModule.h>

@interface ScoresLiveActivityModule : NSObject <RCTBridgeModule>
+(void) startScoresLiveActivity:(NSString *)eventId
                        payload:(NSDictionary *)payload
                       resolver:(RCTPromiseResolveBlock)resolve
                       rejecter:(RCTPromiseRejectBlock)reject;
+(void) endLiveActivity:(NSString *)eventId;
+(void) hasLiveActivity:(NSString *)eventId
               callback:(RCTResponseSenderBlock)callback;

@end
#endif /* ScoresLiveActivityModule_h */
