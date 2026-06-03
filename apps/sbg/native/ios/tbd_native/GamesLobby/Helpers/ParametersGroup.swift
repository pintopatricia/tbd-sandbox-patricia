
/// Helper class created to allow these dictionaries to pass through the concurrency boundaries
/// This class also provides subscript for easiear access to the wrapped dictionary
final class ParametersGroup: @unchecked Sendable {
  var parameters: [String: Any]

  init(_ parameters: [String : Any]) {
    self.parameters = parameters
  }

  subscript(key: String) -> Any? {
    get { return parameters[key] }
    set { parameters[key] = newValue }
  }
}
