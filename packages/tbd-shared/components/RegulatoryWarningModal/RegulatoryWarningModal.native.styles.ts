import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

// These local tokens were created because the warning message needs to keep these styling values
// independently of Brand and theming for Regulatory reasons
const WarningMessageOuterBorder = {
  borderWidth: 2,
  borderColor: "#fff",
};

const WarningMessageContainer: ViewStyle = {
  gap: 8,
  paddingVertical: 14,
  paddingHorizontal: 6,
  backgroundColor: "#fff",
  borderWidth: 18,
  borderColor: "#18181a",
};

const BaseWarningMessageTypography: TextStyle = {
  fontStyle: "normal",
  fontWeight: "700",
  fontFamily: "Helvetica",
  color: "#18181a",
  textAlign: "center",
};

const WarningMessageTitleTypography: TextStyle = {
  ...BaseWarningMessageTypography,
  fontSize: 22,
  lineHeight: 25.3, // 22px * 115%
};

const WarningMessageTextTypography: TextStyle = {
  ...BaseWarningMessageTypography,
  fontSize: 14,
  lineHeight: 16.1, // 14px * 115%
};

const WarningMessageLinkTypography: TextStyle = {
  ...WarningMessageTextTypography,
  textDecorationLine: "underline",
};

export default StyleSheet.create({
  modalContent: {
    padding: tokens.SmSpacingSmall,
  },
  modalContentWrapper: {
    gap: tokens.SmSpacingSmall,
    padding: tokens.SmSpacingXSmall,
  },
  modalContentHeader: {
    flexDirection: "row",
    gap: tokens.SmSpacingXSmall,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  modalContentHeaderIcon: {
    width: tokens.SmSizingUiLarge150,
    height: tokens.SmSizingUiLarge150,
    color: tokens.SmColoursIconInteractivePrimaryInverseActive,
    flexShrink: 0,
  },
  modalContentHeaderTitle: {
    flexShrink: 1,
    flexGrow: 0,
    minWidth: 0,

    ...tokens.SmPromotionHeading1,
    fontSize: 24,
    color: tokens.SmColoursTextStaticPromotionInverse,
    paddingHorizontal: 5, // Prevents italic text from being clipped at the edges
  },
  warningMessageOuterBorder: {
    ...WarningMessageOuterBorder,
  },
  warningMessageContainer: {
    ...WarningMessageContainer,
  },
  warningMessageTitle: {
    ...WarningMessageTitleTypography,
  },
  warningMessageText: {
    ...WarningMessageTextTypography,
  },
  warningMessageLink: {
    ...WarningMessageLinkTypography,
  },
});
