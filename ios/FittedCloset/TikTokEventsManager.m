#import "TikTokEventsManager.h"

#if __has_include(<TikTokBusinessSDK/TikTokBusiness.h>)
#import <TikTokBusinessSDK/TikTokBusiness.h>
#define HAS_TIKTOK 1
#else
#define HAS_TIKTOK 0
#endif

@implementation TikTokEventsManager

RCT_EXPORT_MODULE();

#if HAS_TIKTOK

RCT_EXPORT_METHOD(identify:(NSString *)externalId
                  username:(NSString *)username
                  phone:(NSString *)phone
                  email:(NSString *)email)
{
  [TikTokBusiness logout];
  [TikTokBusiness identifyWithExternalID:externalId
                        externalUserName:username
                             phoneNumber:phone
                                   email:email];
}

RCT_EXPORT_METHOD(logout)
{
  [TikTokBusiness logout];
}

RCT_EXPORT_METHOD(logEvent:(NSString *)eventName parameters:(NSDictionary *)params)
{
  [TikTokBusiness trackEvent:eventName withProperties:params];
}

#else

RCT_EXPORT_METHOD(identify:(NSString *)externalId
                  username:(NSString *)username
                  phone:(NSString *)phone
                  email:(NSString *)email)
{
  NSLog(@"TikTok SDK not available");
}

RCT_EXPORT_METHOD(logout)
{
  NSLog(@"TikTok SDK not available");
}

RCT_EXPORT_METHOD(logEvent:(NSString *)eventName parameters:(NSDictionary *)params)
{
  NSLog(@"TikTok SDK not available");
}

#endif

@end
