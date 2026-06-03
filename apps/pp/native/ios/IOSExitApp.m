#import <UIKit/UIKit.h>
#import "IOSExitApp.h"

@implementation IOSExitApp

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(exitApp)
{
    exit(0);
};

@end
