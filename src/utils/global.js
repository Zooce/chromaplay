import { createSignal } from "solid-js";

export const RGB = "RGB";
export const HSL = "HSL";

export const [colorMode, setColorMode] = createSignal(RGB);
export const [globalBackgroundColor, setGlobalBackgroundColor] = createSignal("#ffffff");
export const [showControls, setShowControls] = createSignal(true);
