#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// HealthKit reports several kinds of misuse — an unknown unit string, sharing a type Apple reserves, a quantity in
/// the wrong dimension — by raising an Objective-C exception. Swift cannot catch those, so in an app they are
/// crashes. Calls that can raise run through this, and the exception becomes an ordinary rejection.
///
/// Returns the exception's reason, or nil when the block completed normally.
NSString *_Nullable HealthSpecCatchException(NS_NOESCAPE void (^block)(void));

NS_ASSUME_NONNULL_END
