package com.skybet.tbd
import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.wix.reactnativenotifications.RNNotificationsPackage
import org.wonday.orientation.OrientationActivityLifecycle
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
    ReactNativeHostWrapper(this, object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Packages that cannot be auto linked yet can be added manually here, for example:
          add(TBDNativeModulesConfigPackage())
          add(RNNotificationsPackage(this@MainApplication))
        }

      override fun getJSMainModuleName(): String = "index"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    })

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)
    
  override fun onCreate() {
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance())

    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    ReactFontManager.getInstance().addCustomFont(this, "Sky Text", R.font.skytext)
    ReactFontManager.getInstance().addCustomFont(this, "SkyText_Md", R.font.skytext_md)
    ReactFontManager.getInstance().addCustomFont(this, "SkyText_Rg", R.font.skytext_rg)
    ReactFontManager.getInstance().addCustomFont(this, "SSportsD", R.font.ssportsd)
    ReactFontManager.getInstance().addCustomFont(this, "SSportsD_Md", R.font.ssportsd_md)

    if (BuildConfig.DEBUG) {
      try {
        /**
         * Using reflection here so that we don't import unnecessary stuff for release
         */
        val OkHttpClientUtilsClass = Class.forName("com.skybet.tbd.OkHttpClientUtils")
        OkHttpClientUtilsClass
          .getMethod("setDevClient")
          .invoke(null)
      } catch (e: ClassNotFoundException) {
        e.printStackTrace()
      } catch (e: InvocationTargetException) {
        e.printStackTrace()
      } catch (e: IllegalAccessException) {
        e.printStackTrace()
      } catch (e: NoSuchMethodException) {
        e.printStackTrace()
      }
    }

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
