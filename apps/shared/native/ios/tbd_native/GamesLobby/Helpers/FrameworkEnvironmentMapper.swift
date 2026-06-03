import Foundation
import GamesFramework

enum TbdEnvironmentMapper {
  fileprivate enum TbdEnvironment: String {
    case mockserver
    case localhost
    case nxt
    case qabranch
    case qacms
    case qa
    case prf
    case prd
    case drk

    init?(bridgeValue: String) {
      self.init(rawValue: bridgeValue)
    }

    var frameworkEnvironmentType: EnvironmentType {
      switch self {
      case .prd:
        return .prod
      case .nxt:
        return .nxt
      case .drk:
        return .drk
      case .mockserver:
        return .mockServer
      case .localhost:
        return .localHost
      case .qabranch:
        return .qaBranch
      case .qacms:
        return .qaCms
      case .qa:
        return .qa
      case .prf:
        return .prf
      }
    }

    func buildFrameworkEnvironment(domain: String, drkHeaderValue: String?) -> FrameworkEnvironment {
      guard self == .drk else {
        return FrameworkEnvironment(type: frameworkEnvironmentType, domain: domain)
      }

      guard let header = drkHeaderValue, !header.isEmpty else {
        assertionFailure("DRK environment requires drkHeaderValue from React Native.")
        NSLog("[TbdEnvironmentMapper] DRK environment selected without a valid drkHeaderValue. Falling back to .prod.")
        return FrameworkEnvironment(type: .prod, domain: domain)
      }

      return .drk(domain: domain, drkHeaderValue: header)
    }
  }
}

extension DynamicFrameworkConfiguration {
  var frameworkEnvironment: FrameworkEnvironment {
    guard let tbdEnvironment = TbdEnvironmentMapper.TbdEnvironment(bridgeValue: environmentType) else {
      assertionFailure("Unsupported environmentType from React Native: \(environmentType)")
      NSLog("[TbdEnvironmentMapper] Unsupported or empty environmentType '\(environmentType)'. Falling back to .prod.")
      return FrameworkEnvironment(type: .prod, domain: environment)
    }
    return tbdEnvironment.buildFrameworkEnvironment(domain: environment, drkHeaderValue: drkHeaderValue)
  }
}
