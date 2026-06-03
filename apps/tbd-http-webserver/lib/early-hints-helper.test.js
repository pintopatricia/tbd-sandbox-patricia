import { buildLinkHeaderValue } from "./early-hints-helper";
import { AsType, RelType } from "./helpers/assets-builder";

describe("Early Hints Helper", () => {
  describe("#buildLinkHeaderValue", () => {
    describe("when the rel type is Stylesheet", () => {
      it("should build as preload", () => {
        expect(
          buildLinkHeaderValue("/betting/", {
            PRELOAD_CSS_ASSETS: [
              { name: "asset.css", rel: RelType.Stylesheet, as: AsType.Style },
              { name: "asset2.css", rel: RelType.Stylesheet, as: AsType.Style },
            ],
            PRELOAD_FONTS: [{ name: "font.woff2", rel: RelType.Preload, as: AsType.Font }],
            PRELOAD_JS_ASSETS: [{ name: "font.js", rel: RelType.Preload, as: AsType.Script }],
          }),
        ).toEqual(
          '</betting/font.woff2>; rel="preload"; as="font", </betting/asset.css>; rel="preload"; as="style", </betting/asset2.css>; rel="preload"; as="style", </betting/font.js>; rel="preload"; as="script"',
        );
      });
    });

    describe("when the rel type is any other", () => {
      it("should build as-is", () => {
        expect(
          buildLinkHeaderValue("/apuestas/es/", {
            PRELOAD_CSS_ASSETS: [],
            PRELOAD_FONTS: [],
            PRELOAD_JS_ASSETS: [
              { name: "asset.js", rel: RelType.Preload, as: AsType.Script },
              { name: "asset2.js", rel: RelType.Preload, as: AsType.Script, crossorigin: true },
            ],
          }),
        ).toEqual(
          '</apuestas/es/asset.js>; rel="preload"; as="script", </apuestas/es/asset2.js>; rel="preload"; as="script"; crossorigin',
        );
      });
    });
  });
});
