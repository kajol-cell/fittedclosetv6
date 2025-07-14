import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import TikTokBusinessSDK

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "FittedCloset"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    if let path = Bundle.main.path(forResource: "Environment", ofType: "plist"),
       let env = NSDictionary(contentsOfFile: path) {

        let ttAppSecret = env["IOS_TIKTOK_APP_SECRET"] as? String ?? ""
        let ttAppId = env["IOS_TIKTOK_APP_ID"] as? String ?? ""
        let ttTtAppId = env["IOS_TIKTOK_TT_APP_ID"] as? String ?? ""
        let environment = (env["ENVIRONMENT"] as? String ?? "").lowercased().trimmingCharacters(in: .whitespacesAndNewlines)

        let config = TikTokConfig(accessToken: ttAppSecret, appId: ttAppId, tiktokAppId: ttTtAppId)
        config?.disableAutomaticTracking()

        if environment != "production" {
            config?.enableDebugMode()
            config?.setLogLevel(TikTokLogLevelDebug)
            print("🚧 TikTok SDK: Enabling DEBUG log level for environment: \(environment)")
        } else {
            print("✅ TikTok SDK: Running in PRODUCTION mode")
        }

        TikTokBusiness.initializeSdk(config) { success, error in
            if success {
                print("✅ TikTok SDK initialized successfully.")
            } else {
                print("❌ TikTok SDK initialization failed: \(error?.localizedDescription ?? "Unknown error")")
            }
        }
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
