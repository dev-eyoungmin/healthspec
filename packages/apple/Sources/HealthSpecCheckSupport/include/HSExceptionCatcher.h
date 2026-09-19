#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// HealthKit reports some misuse (unknown unit strings, types that may not be shared) by raising an
/// Objective-C exception, which Swift cannot catch. The check tool runs those calls through this.
/// Returns the exception's reason, or nil when the block completed normally.
NSString *_Nullable HSCatchException(NS_NOESCAPE void (^block)(void));

NS_ASSUME_NONNULL_END
