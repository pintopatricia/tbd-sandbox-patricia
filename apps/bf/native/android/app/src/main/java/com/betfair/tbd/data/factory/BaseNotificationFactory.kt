package com.betfair.tbd.data.factory

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.betfair.tbd.R

open class BaseNotificationFactory(open val context: Context) {

  /**
   * Creates a default notification builder.
   *
   * @return [NotificationCompat.Builder] the notification builder.
   */
  open fun createNotificationBuilder(): NotificationCompat.Builder? =
    NotificationCompat.Builder(context, NotificationChannelFactory.CHANNEL_ID)
      .setAutoCancel(true)
      .setColor(ContextCompat.getColor(context, R.color.splashscreen_bg))
      .setContentTitle("Betfair")
      .setDefaults(NotificationCompat.DEFAULT_ALL)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setSmallIcon(R.drawable.ic_notification);
}
