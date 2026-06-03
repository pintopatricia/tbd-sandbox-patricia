package com.paddypower.tbd.data.factory;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.ContextWrapper;

import com.paddypower.tbd.BuildConfig;

/**
 * This class is responsible for create notification channels.
 */
public class NotificationChannelFactory extends ContextWrapper {


  public static final String CHANNEL_ID = BuildConfig.APPLICATION_ID + ".APP_CHANNEL_ID";

  private static final String CHANNEL_NAME = "App Notifications";

  public NotificationChannelFactory(Context context) {
    super(context);
    createNotificationChannel();
  }

  private void createNotificationChannel() {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME,
        NotificationManager.IMPORTANCE_HIGH);

      notificationChannel.setShowBadge(true);
      notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
      notificationChannel.setImportance(NotificationManager.IMPORTANCE_HIGH);

      getNotificationManager().createNotificationChannel(notificationChannel);
    }
  }

  private NotificationManager getNotificationManager() {
    return (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
  }

}
