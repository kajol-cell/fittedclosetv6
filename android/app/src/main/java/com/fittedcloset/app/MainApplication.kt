package com.fittedcloset.app

import android.app.Application
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.tiktok.TikTokBusinessSdk;
import com.tiktok.TikTokBusinessSdk.TTConfig;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
                add(TikTokEventsManagerPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
      val logger = "TikTokEventsManager"
      Log.d(logger, "TikTok SDK Initialization successful in ${BuildConfig.ENVIRONMENT}")
      val isProd = BuildConfig.ENVIRONMENT == "production"

      val ttConfig = TTConfig(applicationContext, BuildConfig.ANDROID_TIKTOK_APP_SECRET)
          .setAppId(BuildConfig.ANDROID_TIKTOK_APP_ID) // Replace with your app's package name
          .setTTAppId(BuildConfig.ANDROID_TIKTOK_TT_APP_ID) // Replace with your TikTok App ID

      ttConfig.disableAutoEvents()

      if (!isProd) {
          ttConfig.setLogLevel(TikTokBusinessSdk.LogLevel.DEBUG).openDebugMode()
      }

      TikTokBusinessSdk.initializeSdk(ttConfig, object : TikTokBusinessSdk.TTInitCallback {
          override fun success() {
              if (isProd) {
                  Log.d(logger, "In production, not enabling debug")
              }
              else {
                  Log.d(logger, "Not in production, debug enabled")
                  TikTokBusinessSdk.enableDebugMode()
              }
              TikTokBusinessSdk.startTrack()
          }

          override fun fail(code: Int, msg: String) {
              Log.e("TikTokEventsManager", "TikTok SDK Initialization failed: $msg")
          }
      })
  }
}
