// TBDPerformanceModule.m
#import "TBDPerformanceModule.h"
#import "TBDCurrentScreenModule.h"
#import <React/RCTEventEmitter.h>

#define SAMPLE_SIZE 5

@implementation TBDPerformanceModule

bool shouldStop = NO;
bool isInBackground = NO;
int _frameCount = -1;
float _FPS = 0;
NSTimeInterval _prevTime = -1;
CADisplayLink *displayLink = nil;
NSMutableArray <NSNumber *> *FPSSamples;
NSString *urn;

// To export a module named TBDPerformanceModule
RCT_EXPORT_MODULE();

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                          selector:@selector(handleAppDidBecomeActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                          selector:@selector(handleAppDidEnterBackground)
                                                 name:UIApplicationDidEnterBackgroundNotification
                                               object:nil];
  }
  return self;
}

RCT_EXPORT_METHOD(startUIFpsTracking)
{
  if (shouldStop || isInBackground) {
    [TBDPerformanceModule stopUIFpsTracking];
  }
  FPSSamples = [[NSMutableArray alloc] init];
  shouldStop = YES;
  _frameCount = -1;
  _prevTime = -1;

  displayLink = [CADisplayLink displayLinkWithTarget:self
                                                            selector:@selector(step:)];
  [displayLink addToRunLoop:[NSRunLoop mainRunLoop]
                  forMode:NSRunLoopCommonModes];
}

+(void) stopUIFpsTracking
{
  [displayLink invalidate];
  displayLink = nil;
  shouldStop = NO;
}

// Function that is called on every render cycle of the app
// displayLink has the current timestamp in seconds for each render frame
- (void) step:(CADisplayLink *) displayLink
{
  _frameCount++;
  if (_prevTime == -1)
  {
    _prevTime = displayLink.timestamp;
  } else if (displayLink.timestamp - _prevTime >= 1)
  {
    _FPS = round(_frameCount / (displayLink.timestamp - _prevTime));

    [FPSSamples addObject:(@(_FPS))];
    NSUInteger arrayLength = [FPSSamples count];

    if (arrayLength == SAMPLE_SIZE)
    {
      NSNumber *FPSAverage = [FPSSamples valueForKeyPath:@"@avg.floatValue"];
      NSString *screenName = [TBDCurrentScreenModule getCurrentScreenStatic];
      NSString *modifiedScreenName = [screenName stringByReplacingOccurrencesOfString:@":" withString:@"_"];
      //[NewRelic recordMetricWithName:(NSString *)@"PerformanceFPSNative"  category:(NSString *)modifiedScreenName  value:(NSNumber *)FPSAverage];

      FIRTrace *traceUIFrameRate = [FIRPerformance startTraceWithName:@"FPS"];
      [traceUIFrameRate setValue:modifiedScreenName forAttribute:@"ScreenName"];
      [traceUIFrameRate setIntValue:[FPSAverage intValue] forMetric:@"Value"];
      [traceUIFrameRate stop];

      [FPSSamples removeAllObjects];
    }

    _prevTime = displayLink.timestamp;
    _frameCount = 0;
  }
}

- (void)handleAppDidBecomeActive {
  isInBackground = NO;
  [self startUIFpsTracking];
}

- (void)handleAppDidEnterBackground {
  isInBackground = YES;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
