import { createSignal } from "solid-js";

export const RGB = "RGB";
export const HSL = "HSL";

export const [colorMode, setColorMode] = createSignal(RGB);
