//
//  LiveActivityDataStore.swift
//  tbd_native
//

import Foundation

enum LiveActivityDataUpdateResult {
  case updated(LiveActivityData)
  case unchanged(LiveActivityData)
  case notFound
}

class LiveActivityDataStore {
  // MARK: - Properties
  
  private let userDefaults: UserDefaults
  private var items: [LiveActivityData] = []
  
  // MARK: - Init
  init(userDefaults: UserDefaults = .standard) {
    self.userDefaults = userDefaults
    self.items = loadDataStore()
  }
  
  // MARK: - Public API
  
  func addItem(eventId: String,
               activityId: String) {
    guard !items.contains(where: { $0.activityId == activityId }) else {
      return
    }
    
    defer { persistDataStore() }
    
    let newItem = LiveActivityData(eventId: eventId,
                                   activityId: activityId,
                                   pushToken: nil)
    
    items.append(newItem)
  }
  
  func updatePushToken(_ pushToken: String,
                       forActivityId activityId: String) -> LiveActivityDataUpdateResult {
    guard let index = items.firstIndex(where: { $0.activityId == activityId }) else {
      return .notFound
    }
    
    let previousItem = items[index]
    guard previousItem.pushToken != pushToken else {
      return .unchanged(previousItem)
    }
    
    defer { persistDataStore() }
    
    let item = LiveActivityData(eventId: previousItem.eventId,
                                activityId: previousItem.activityId,
                                pushToken: pushToken)
    items[index] = item
    
    return .updated(item)
  }
  
  func removeByEventId(_ eventId: String) -> LiveActivityData? {
    guard let item = item(for: eventId) else {
      return nil
    }
    
    defer { persistDataStore() }
    items.removeAll { $0.eventId == eventId }
    return item
  }
  
  func removeByActivityId(_ activityId: String) {
    guard items.contains(where: { $0.activityId == activityId }) else {
      return
    }
    
    defer { persistDataStore() }
    items.removeAll { $0.activityId == activityId }
  }
  
  func sync(withActivityIds validActivityIds: [String]) -> [LiveActivityData] {
    let validSet = Set(validActivityIds)
    
    var removedItems: [LiveActivityData] = []
    
    items.removeAll { item in
      let shouldRemove = !validSet.contains(item.activityId)
      if shouldRemove {
        removedItems.append(item)
      }
      return shouldRemove
    }
    
    if !removedItems.isEmpty {
      persistDataStore()
    }
    
    return removedItems
  }
  
  func hasLiveActivity(for eventId: String) -> Bool {
    return items.contains(where: { $0.eventId == eventId })
  }
  
  func item(for eventId: String) -> LiveActivityData? {
    items.first(where: { $0.eventId == eventId })
  }
  
  func item(activityId: String) -> LiveActivityData? {
    items.first(where: { $0.activityId == activityId })
  }
  
  // MARK: - Persistence
  
  private func persistDataStore() {
    do {
      let data = try JSONEncoder().encode(items)
      userDefaults.set(data, forKey: Constants.storageKey)
    } catch {
      print("Failed to persist LiveActivityDataStore:", error)
    }
  }
  
  private func loadDataStore() -> [LiveActivityData] {
    guard let data = userDefaults.data(forKey: Constants.storageKey) else {
      return []
    }
    
    do {
      return try JSONDecoder().decode([LiveActivityData].self, from: data)
    } catch {
      print("Failed to load LiveActivityDataStore:", error)
      return []
    }
  }
}

private extension LiveActivityDataStore {
  enum Constants {
    static let storageKey: String = "liveActivityDataStore.items"
  }
}
