//
//  ImageDownloader.swift
//  tbd_native
//
//  Created by Pedro Silva on 10/03/2026.
//

import Foundation
import UIKit

enum ImageDownloaderError: Error {
  case badURL(String)
  case loadingContainer(String)
}

class ImageDownloader {
  let appGroup: String
  let fileManager: FileManager
  let session: URLSession
  
  init(appGroup: String,
       fileManager: FileManager = .default,
       session: URLSession = .shared) {
    self.appGroup = appGroup
    self.fileManager = fileManager
    self.session = session
  }
  
  @discardableResult
  func storeImage(from urlString: String,
                  filename: String) async throws -> URL {
    guard let url = URL(string: urlString) else {
      throw ImageDownloaderError.badURL(urlString)
    }
    
    guard let containerURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: appGroup) else {
      throw ImageDownloaderError.loadingContainer("Failed to create app group container URL")
    }
    
    let (data, _) = try await session.data(from: url)
    
    let fileURL = containerURL.appendingPathComponent(filename)
    
    try data.write(to: fileURL,
                   options: .atomic)
    
    return fileURL
  }
  
  func loadImage(named name: String) -> UIImage? {
    guard let container = fileManager
      .containerURL(forSecurityApplicationGroupIdentifier: appGroup)
    else { return nil }
    
    let path = container.appendingPathComponent(name).path
    return UIImage(contentsOfFile: path)
  }
}
