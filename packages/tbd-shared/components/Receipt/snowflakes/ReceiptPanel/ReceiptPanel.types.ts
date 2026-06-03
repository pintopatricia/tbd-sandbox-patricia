export type ReceiptPanelOnDismissPress = () => void;

export type ReceiptPanelCallbacks = {
  onDismissPress: ReceiptPanelOnDismissPress;
};

export type ReceiptPanelProps = {
  children?: React.ReactNode;
  receiptTitle: string;
  detailTitle: string;
  detailSubtitle?: string;
  segmentLeftValue?: string;
  segmentLeftLabel?: string;
  segmentRightValue?: string;
  segmentRightLabel?: string;
  buttonText?: string;
  errorMessage?: string;
  errorDetail?: string;
};

export type ReceiptPanelViewModel = ReceiptPanelProps & ReceiptPanelCallbacks;
