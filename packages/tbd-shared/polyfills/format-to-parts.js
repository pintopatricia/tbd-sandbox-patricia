export default function applyFormatToPartsPolyfill() {
  /**
   * iOS <=12 doesn't support Intl.NumberFormat.formatToParts
   */
  if (typeof Intl.NumberFormat.prototype.formatToParts !== "function") {
    const regex = /0|\.|,/g; // find "0", "," and "."

    Intl.NumberFormat.prototype.formatToParts = function formatToParts() {
      const { locale, currency } = this.resolvedOptions();
      const numberFormat = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      });
      const currencySymbol = numberFormat.format(0).replace(regex, "").trim(); // "£ 0.00" => "£"

      return [{ type: "currency", value: currencySymbol }];
    };
  }
}
