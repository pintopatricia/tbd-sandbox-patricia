/// Global actor created to help isolate concurrent code for games integration where required
@globalActor actor GamesActor {
  static let shared = GamesActor()
}
