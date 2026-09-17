#import "HealthSpecExceptionCatcher.h"

NSString *_Nullable HealthSpecCatchException(NS_NOESCAPE void (^block)(void)) {
  @try {
    block();
    return nil;
  } @catch (NSException *exception) {
    return exception.reason ?: exception.name;
  }
}
