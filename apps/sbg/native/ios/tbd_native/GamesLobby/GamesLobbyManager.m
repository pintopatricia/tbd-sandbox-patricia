#import "GamesLobbyManager.h"

@implementation GamesLobbyManager

// To export a module named GamesLobbyManager
RCT_EXPORT_MODULE();

- (UIView *)view {
    return [[GamesLobbyView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(configs, NSDictionary)
@end
