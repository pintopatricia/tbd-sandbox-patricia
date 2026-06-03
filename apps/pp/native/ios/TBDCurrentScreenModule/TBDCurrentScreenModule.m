#import "TBDCurrentScreenModule.h"

@implementation TBDCurrentScreenModule {
  NSString *currentScreen;
}

// Static string
static NSString *currentScreen = @"InitialLoad";

RCT_EXPORT_MODULE(TBDCurrentScreenModule);

// Static method to get the current screen similar to the java version.
+ (NSString *)getCurrentScreenStatic {
  return currentScreen;
}

// set static screenName
+ (void)setCurrentScreen:(NSString *)screenName {
  currentScreen = screenName;
}

// React Native method to set the current screen
RCT_EXPORT_METHOD(setCurrentScreen:(NSString *)screenName) {
  [TBDCurrentScreenModule setCurrentScreen:screenName];
}

@end
