export type MyAccountInterfaceState = {
  isOpen: boolean;
  firstName: string;
  jurisdiction: string;
} & MyAccountInterfaceOpenState;

export type MyAccountInterfaceOpenState = {
  isOpen: boolean;
};
