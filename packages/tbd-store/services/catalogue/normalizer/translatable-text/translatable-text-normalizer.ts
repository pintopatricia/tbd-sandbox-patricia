import type { TranslatableTextFragment } from "../../../../clients/catalogue/catalogue-response-types";
import type { TranslatableText } from "../../../../state/layout/cards/Card.types";
import type { TransformedFragment } from "../Normalizer.types";

const normalizeTranslatableTextFragmentIntoTranslatableText = ({
  translated,
  translate,
}: TranslatableTextFragment): TransformedFragment<TranslatableText> => ({
  data: {
    translated: translated || undefined,
    translate: translate || undefined,
  },
});

export default normalizeTranslatableTextFragmentIntoTranslatableText;
