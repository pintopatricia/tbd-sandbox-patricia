package com.paddypower.tbd.data.factory

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.core.app.NotificationCompat
import com.paddypower.tbd.MainActivity
import com.squareup.picasso.Picasso

/**
 * This class is responsible to build the Adobe Marketing notification Builder.
 */
class AdobeNotificationFactory(override val context: Context, val message: Bundle) : BaseNotificationFactory(context) {

  init {
    NotificationChannelFactory(context)
  }

  override fun createNotificationBuilder(): NotificationCompat.Builder? {

    val pushMessageMsg: String? = message.getString(PUSH_NOTIFICATION_MSG)
    val pushMessageMediaAttachmentUrl: String? = message.getString(PUSH_NOTIFICATION_MEDIA_ATTACHMENT_URL)

    if (pushMessageMsg == null) {
      Log.e("AdobeNotificationFactory", "No message found in adobe payload.")
      return null
    }

    val notificationIntent = Intent(context, MainActivity::class.java)
    notificationIntent.putExtra(EXTRA_ADOBE_PUSH_MESSAGE, message)
    notificationIntent.putExtra("pushNotification", message)

    val pendingFlags: Int = if (Build.VERSION.SDK_INT >= 31) {
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    } else {
      PendingIntent.FLAG_UPDATE_CURRENT
    }
    val pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, pendingFlags)

    val builder = super.createNotificationBuilder()
      ?.setContentIntent(pendingIntent)
      ?.setContentText(pushMessageMsg.toString())
      ?.setStyle(NotificationCompat.BigTextStyle().bigText(pushMessageMsg))

    pushMessageMediaAttachmentUrl?.let {

      if (pushMessageMediaAttachmentUrl.isEmpty()) {
        return@let
      }

      val pushMessageMsgTitle: String? = message.getString(PUSH_NOTIFICATION_BIG_CONTENT_TITLE)

      val richImage: Bitmap

      try {
        richImage = Picasso.with(context).load(pushMessageMediaAttachmentUrl).get()
      } catch (e: Exception) {
        Log.e("AdobeNotificationFactory", "Failed to download image with error -> ${e.message} || \n For rich push media attachment url -> ${pushMessageMediaAttachmentUrl}")

        return null
      }

      val richNotificationStyle = NotificationCompat.BigPictureStyle()
        .bigPicture(richImage)
        .setSummaryText(pushMessageMsg.toString())

      pushMessageMsgTitle?.let { richNotificationStyle.setBigContentTitle(it) }

      builder?.setStyle(richNotificationStyle)
    }

    return builder
  }

  companion object {

    const val EXTRA_ADOBE_PUSH_MESSAGE = "EXTRA_ADOBE_PUSH_MESSAGE"
    const val PUSH_NOTIFICATION_MSG = "_msg"
    const val PUSH_NOTIFICATION_MEDIA_ATTACHMENT_URL = "media_attachment_url"

    private const val PUSH_NOTIFICATION_BIG_CONTENT_TITLE = "title"
  }

}
