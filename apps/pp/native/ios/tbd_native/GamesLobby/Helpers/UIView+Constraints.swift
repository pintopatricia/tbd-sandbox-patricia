import UIKit

extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder!.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }

    func fillSuperviewWidth() {
        fillSuperviewWidthWithInsets(.zero)
    }

    func fillSuperviewHeight() {
        fillSuperviewHeightWithInsets(.zero)
    }

    func fillSuperviewHeightWithInsets(_ insets: UIEdgeInsets) {
        superview?.addConstraintsWithFormat(format: "V:|-tInsets-[view]-bInsets-|",
                                            metrics: ["tInsets": insets.top as AnyObject, "bInsets": insets.bottom as AnyObject],
                                            views: ["view": self])
    }

    func fillSuperviewWidthWithInsets(_ insets: UIEdgeInsets) {
        superview?.addConstraintsWithFormat(format: "H:|-lInsets-[view]-rInsets-|",
                                            metrics: ["lInsets": insets.left as AnyObject, "rInsets": insets.right as AnyObject],
                                            views: ["view": self])
    }

    func addConstraintsWithFormat(format: String,
                                  metrics: [String : AnyObject]? = nil,
                                  views: [String: AnyObject],
                                  options: NSLayoutConstraint.FormatOptions = []) {

        let constraints = NSLayoutConstraint.constraints(withVisualFormat: format,
                                                         options: options,
                                                         metrics: metrics,
                                                         views: views)
        NSLayoutConstraint.activate(constraints)
    }
}
