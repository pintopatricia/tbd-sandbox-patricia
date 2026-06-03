//
//  NotificationService.swift
//  NotificationServiceExtension
//
//  Created by Diogo Teixeira on 13/12/2021.
//
//  Source: https://gitlab.app.betfair/iOSWrappers/BFExchange/-/blob/develop/BFExchange/BetfairExchangeNotificationExtension/NotificationService.swift
//

import UserNotifications

final class NotificationService: UNNotificationServiceExtension, @unchecked Sendable {
    var contentHandler: ((UNNotificationContent) -> Void)?
    var notificationMediaContent: UNMutableNotificationContent?
    var mediaFileExtension: String = ""
    
  override func didReceive(
               _ request: UNNotificationRequest,
               withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        notificationMediaContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        FileManager.default.clearTmpDirectory()
        // Get the custom data from the notification payload
        if let media_attachment_url = request.content.userInfo["media_attachment_url"] as? String {
            if media_attachment_url != "", let fileUrl = URL(string: media_attachment_url) {
                downloadMediaContent(fileUrl: fileUrl)
            } else {
                self.failEarly(error: "NotificationService - Media Attachment Url not found")
            }
        } else {
            self.failEarly(error: "NotificationService - Media Attachment Url not found")
        }
    }
    
    func failEarly(error: String) {
        if let contentHandler = self.contentHandler, let mediaContent =  self.notificationMediaContent {
            contentHandler(mediaContent)
        }
    }
    
    func downloadMediaContent(fileUrl: URL) {
        // Download the attachment
        URLSession.shared.downloadTask(with: fileUrl) { (location, response, error) in
            if error != nil {
                self.failEarly(error: "NotificationService - \(error.debugDescription)")
                return
            }
            if let location = location, let contentType = response?.mimeType {
                do {
                    // Move temporary file to remove .tmp extension
                    if let tmpDirectory = self.createTmpDirectory(fileContentType: contentType) {
                        try FileManager.default.moveItem(at: location, to: tmpDirectory)
                        // Add the attachment to the notification content
                        do {
              let attachment = try UNNotificationAttachment(identifier: "richPushMedia", url: tmpDirectory, options: nil)
                            self.notificationMediaContent?.userInfo["mediaExtension"] = self.mediaFileExtension
                            self.notificationMediaContent?.attachments = [attachment]
                        } catch {
                            print("NotificationService - Error Creating Attachment: \(error.localizedDescription)")
                        }
                    }
                } catch {
                    self.failEarly(error: "NotificationService - \(error.localizedDescription)")
                }
            } else {
                self.failEarly(error: "NotificationService - no valid location")
            }
            // Serve the notification content
            if let contentHandler = self.contentHandler, let mediaContent =  self.notificationMediaContent {
                contentHandler(mediaContent)
            }
            }.resume()
    }
    
    /**
     Renames the downloaded file to it's proper extension by moving it
     */
    
    func createTmpDirectory(fileContentType: String) -> URL? {
        // Move temporary file to remove .tmp extension
        if let fileExtension = getExtensionFromContentType(contentType: fileContentType) {
      let temporaryDirectory = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("file." + fileExtension)
            mediaFileExtension = fileExtension
            return temporaryDirectory
        }
        return nil
    }
    
    /**
     Gets the file extension from the content-type header in URLResponse
     */
  func getExtensionFromContentType(contentType: String) -> String? {
    //If Content type is video/mpeg, mediatype = "video" and return value will be "mpeg"
    let contentTypeSplit = contentType.components(separatedBy: "/")
    if let mediaType = contentTypeSplit.first, let mediaExtension = contentTypeSplit.last {
      switch mediaType {
      case "image":
        if let imageExtension = ContentType.Image.allCases.first(where: {$0.rawValue.contains(mediaExtension)}) {
          return String(describing: imageExtension)
        }

      case "video":
        if let videoExtension = ContentType.Video.allCases.first(where: {$0.rawValue.contains(mediaExtension)}) {
          return String(describing: videoExtension)
        }

      case "audio":
        if let audioExtension = ContentType.Audio.allCases.first(where: {$0.rawValue.contains(mediaExtension)}) {
          return String(describing: audioExtension)
        }

      default:
        return mediaExtension
      }      
    }
    return nil
  }
}

extension FileManager {
    func clearTmpDirectory() {
        do {
            let tmpDirURL = FileManager.default.temporaryDirectory
            let tmpDirectory = try contentsOfDirectory(atPath: tmpDirURL.path)
            try tmpDirectory.forEach { file in
                let fileUrl = tmpDirURL.appendingPathComponent(file)
                try removeItem(atPath: fileUrl.path)
            }
        } catch {
            print("NotificationService - Media Attachment Url not found")
            return
        }
    }
}
enum ContentType {
    enum Image: String, CaseIterable {
        case jpg
        case png
        case jpeg
        case gif
    }
    
    enum Audio: String, CaseIterable {
        case mp3 = "mpeg"
        case mp4
        case wav
        case aiff
    }
    
    enum Video: String, CaseIterable {
        case avi = "x-msvideo"
        case mp4
        case mpeg
        case mpeg2
        case webm
        case wmv = "x-ms-wmv"
    }
}
