#import "RCTStartupTime.h"

@implementation RCTStartupTime

RCT_EXPORT_MODULE()

NSTimeInterval startupTimeMark;
BOOL hasEnteredToBackground;

- (instancetype)init {
  if (self = [super init]) {
    hasEnteredToBackground = NO;
    startupTimeMark = [[NSProcessInfo processInfo] systemUptime];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidEnterBackground:) name:UIApplicationDidEnterBackgroundNotification object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)applicationDidEnterBackground:(NSNotification *)notification {
  hasEnteredToBackground = YES;
}

RCT_EXPORT_METHOD(getTimeSinceStartup:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSTimeInterval currentTimeMark = [[NSProcessInfo processInfo] systemUptime];
    CFTimeInterval startupTimeDelta = currentTimeMark - startupTimeMark;
    NSDictionary *result = @{
      @"isColdStartup": [NSNumber numberWithBool:![[NSNumber numberWithBool:hasEnteredToBackground] boolValue]],
      @"time": [NSNumber numberWithDouble:ceil(startupTimeDelta * 1000)]
    };
    resolve(result);
  }
  @catch (NSError *error) {
    reject(@"StartupTime", error.localizedDescription, error);
  }
}

@end
