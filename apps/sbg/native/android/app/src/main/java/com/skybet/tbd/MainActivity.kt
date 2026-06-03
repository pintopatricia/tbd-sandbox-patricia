package com.skybet.tbd
import expo.modules.ReactActivityDelegateWrapper

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import com.adobe.marketing.mobile.CampaignClassic
import com.adobe.marketing.mobile.MobileCore
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen
import java.util.Arrays

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "tbd_native"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)

    /**
     * At the time of writing, we started experiencing crashes on the ScreenFragment class.
     * It appeared to be an exception caused by the third-party react-native-screens used as
     * a dependency for react-navigation. Their official website suggests to pass `null` below
     * with onCreate to avoid the crashes:
     *
     * "You should add this code, which specifically discards any Activity state persisted
     * during the Activity restart process, to avoid inconsistencies that lead to crashes."
     *
     * While it does not seem to be the optimal solution, it will serve as a workaround for now.
     * Reference: https://github.com/software-mansion/react-native-screens#android
     */
    super.onCreate(null)

    MobileCore.setApplication(application)

    MobileCore.registerExtensions(
      Arrays.asList(CampaignClassic.EXTENSION)
    ) { o: Any? ->
      MobileCore.lifecycleStart(null)
    }
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    val intent = Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    this.sendBroadcast(intent)
  }
}
