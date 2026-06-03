import { IconsList, type Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

const isValidIcon = (icon: string): icon is Icons => Object.values(IconsList).some((i): boolean => i === icon);

export const getIcon = (icon?: string): Icons | undefined => (icon && isValidIcon(icon) ? icon : undefined);
