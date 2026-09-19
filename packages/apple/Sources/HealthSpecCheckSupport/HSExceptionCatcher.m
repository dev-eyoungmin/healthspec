#import "HSExceptionCatcher.h"

NSString *_Nullable HSCatchException(NS_NOESCAPE void (^block)(void)) {
  @try {
    block();
    return nil;
  } @catch (NSException *exception) {
    return exception.reason ?: exception.name;
  }
}
