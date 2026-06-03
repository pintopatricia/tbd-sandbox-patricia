import { ApplicationState } from "../ApplicationState.types";
import { HamburgerMenuState } from "./HamburgerMenuState.types";

export const getHamburgerMenuState = (state: ApplicationState): HamburgerMenuState => state.hamburgerMenu;
