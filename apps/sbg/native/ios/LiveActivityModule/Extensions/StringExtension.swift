//
//  StringExtension.swift
//  tbd_native
//

import CryptoKit

extension String {
  func convertToFilename(_ pathExtension: String = "png") -> String {
    let data = Data(self.utf8)
    let hash = SHA256.hash(data: data)
    let hex = hash.compactMap { String(format: "%02x", $0) }.joined()
    
    return "\(hex).\(pathExtension)"
  }
}
