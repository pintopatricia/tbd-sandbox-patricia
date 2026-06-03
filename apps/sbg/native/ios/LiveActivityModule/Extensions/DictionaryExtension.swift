//
//  DictionaryExtension.swift
//  tbd_native

import Foundation

extension Dictionary where Key == String, Value == Any {
  func decode<T: Decodable>(
    _ type: T.Type,
    using decoder: JSONDecoder = JSONDecoder()
  ) throws -> T {
    
    let data = try JSONSerialization.data(withJSONObject: self)
    return try decoder.decode(T.self, from: data)
  }
}
