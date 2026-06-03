//
//  ScoresLiveActivityModule.m
//  tbd_native
//
//  Created by Pedro Silva on 17/02/2026.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScoresLiveActivityModule, NSObject)

RCT_EXTERN_METHOD(startScoresLiveActivity:(NSString *)eventId payload:(NSDictionary *)payload resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(terminateScoresLiveActivity:(NSString *)eventId callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(hasLiveActivity:(NSString *)eventId callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getFinishedPushTokens:(RCTResponseSenderBlock)callback)

@end
