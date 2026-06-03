#import "RCTAirshipConfigModule.h"
#import "UARCTAutopilot.h"

@implementation RCTAirshipConfigModule

// To export a module named RCTAirshipConfigModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getAppKey:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
{
  resolve([[UAConfig defaultConfig] appKey]);
}

@end
