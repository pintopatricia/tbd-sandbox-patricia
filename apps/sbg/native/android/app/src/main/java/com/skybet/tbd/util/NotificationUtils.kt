package com.skybet.tbd.util

/**
 * Notification's related operations.
 */
object NotificationUtils {
  const val TYPE_MARKETING = "N_MT"

  /**
   * Check if the notification open is an adobe push notification. As recommended by NSS this should be done by
   * checking if the payload contains the `deliveryId` and the `messageId`.
   *
   * @param deliveryId The delivery id of the adobe push notification.
   * @param messageId The message id of the adobe push notification.
   *
   * @return `true` if the push comes from adobe, otherwise `false`.
   */
  fun isAdobePush(deliveryId: String?, messageId: String?): Boolean {
    return deliveryId != null && messageId != null
  }

}

