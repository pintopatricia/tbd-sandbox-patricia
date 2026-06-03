package com.skybet.tbd.data.service

import android.app.NotificationManager
import android.content.Context
import android.os.Bundle
import android.util.Log
import com.skybet.tbd.data.factory.AdobeNotificationFactory
import com.skybet.tbd.data.factory.AdobeNotificationFactory.Companion.PUSH_NOTIFICATION_MSG
import com.skybet.tbd.util.NotificationUtils
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.urbanairship.push.fcm.AirshipFirebaseIntegration
import kotlinx.coroutines.*
import kotlin.coroutines.CoroutineContext
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class FcmMessagingService : FirebaseMessagingService(), CoroutineScope {


  override val coroutineContext: CoroutineContext
    get() = Dispatchers.Main

  companion object {
    const val PUSH_NOTIFICATION_ADOBE_DELIVER_ID = "_dId"
    const val PUSH_NOTIFICATION_ADOBE_MESSAGE_ID = "_mId"
  }

  /**
   * When the target device receives a notification, onMessageReceived is called.
   */
  override fun onMessageReceived(remoteMessage: RemoteMessage) {
    super.onMessageReceived(remoteMessage)

    val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val adobePushMessage = parseRemoteMessageToBundle(remoteMessage)

    val messageId: String? = adobePushMessage.getString(PUSH_NOTIFICATION_ADOBE_MESSAGE_ID)
    val deliveryId: String? = adobePushMessage.getString(PUSH_NOTIFICATION_ADOBE_DELIVER_ID)
    val message: String? = adobePushMessage.getString(PUSH_NOTIFICATION_MSG)
    sendEventToReactNative(adobePushMessage)
    when {
      NotificationUtils.isAdobePush(deliveryId, messageId) -> message?.let {
        launch {
          val adobeNotification = async(Dispatchers.IO) {
            AdobeNotificationFactory(this@FcmMessagingService, adobePushMessage)
              .createNotificationBuilder()
              ?.build()
          }

          withContext(Dispatchers.Main) {
            adobeNotification.await()?.takeIf { !messageId.isNullOrEmpty() }?.let {
              notificationManager.notify(Integer.valueOf(messageId!!), it)
            }
          }
        }
      } ?: run {
        Log.e("MessagingService", "No message found in adobe payload.")
      }

      else -> run {
        AirshipFirebaseIntegration.processMessageSync(this, remoteMessage)

        return
      }
    }
  }

  private fun sendEventToReactNative(bundle: Bundle) {
    val reactContext = (application as ReactApplication).reactNativeHost.reactInstanceManager.currentReactContext
    reactContext?.let { context ->
      val params: WritableMap = Arguments.createMap()
      for (key in bundle.keySet()) {
        params.putString(key, bundle.getString(key))
      }
      context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("PushNotificationReceived", params)
    }
  }

  private fun parseRemoteMessageToBundle(remoteMessage: RemoteMessage): Bundle {
    val bundle = Bundle()

    for ((key, value) in remoteMessage.data) {
      bundle.putString(key, value)
    }

    return bundle
  }

}
