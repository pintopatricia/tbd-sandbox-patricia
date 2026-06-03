#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GamesLobbyObject, NSObject)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXTERN_METHOD(triggerConfirmationPopUp:(BOOL *) value)
RCT_EXTERN_METHOD(gamesLobbyTabActive:(BOOL *) value)
RCT_EXTERN_METHOD(closeModalView:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(openWebView:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
