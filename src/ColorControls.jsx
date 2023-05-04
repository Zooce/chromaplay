import { createSignal, createMemo, createEffect, untrack } from "solid-js";
import ColorComponentControl from "./ColorComponentControl";
import { RGB, HSL, colorMode } from "./colorMode";
import { rgbToHsl, hslToRgb, hexToRgb, hexToHsl } from "./colorUtils";
import styles from "./ColorControls.module.css";

function ColorControls(props) {
  const [v1, setV1] = createSignal(0);
  const [v2, setV2] = createSignal(0);
  const [v3, setV3] = createSignal(0);

  // recalculate the values whenever `colorMode` changes
  createEffect(() => {
    if (colorMode() === RGB) {
      const [r, g, b] = hslToRgb(untrack(v1), untrack(v2), untrack(v3));
      setV1(r);
      setV2(g);
      setV3(b);
    } else {
      const [h, s, l] = rgbToHsl(untrack(v1), untrack(v2), untrack(v3));
      setV1(h);
      setV2(s);
      setV3(l);
    }
  });

  // update the background color whenever a color component value changes
  const backgroundColor = createMemo(() => {
    const x = v1(), y = v2(), z = v3();
    let bg;
    switch (untrack(colorMode)) {
      case RGB: bg = `rgb(${x}, ${y}, ${z})`; break;
      case HSL: bg = `hsl(${x}, ${y}%, ${z}%)`; break;
    }
    let style = { "background-color": bg };
    if (props.selected()) {
      style = { ...style, "outline": "dodgerblue solid", "outline-offset": "0.1rem" };
    }
    return style;
  });

  const colorClick = () => props.setSelected(!props.selected());

  // update the hex value whenever a color component value changes
  const hex = () => {
    let color = [v1(), v2(), v3()];
    if (untrack(colorMode) === HSL) {
      color = hslToRgb(...color)
    }
    return `#${color.map(c => c.toString(16).padStart(2, 0)).join('')}`
  }

  const hexInput = (event) => {
    let newHex = event.target.value;
    if (newHex.length === 6 && !newHex.startsWith('#')) {
      newHex = `#${newHex}`;
    } else if (newHex.length !== 7) {
      return;
    }
    try {
      const [r, g, b] = hexToRgb(newHex);
      let values = [r, g, b];
      if (untrack(colorMode) === HSL) {
        values = rgbToHsl(r, g, b);
      }
      setV1(values[0]);
      setV2(values[1]);
      setV3(values[2]);
    } catch {
      // invalid hex color input - just ignore it
    }
  }

  return (
    <div class={styles.ColorControls}>
      <div class={styles.ColorBlock} style={backgroundColor()} onClick={colorClick}></div>
      <input class={styles.HexInput} type="text" maxlength="7" value={hex()} onInput={hexInput} />
      <div>
        <ColorComponentControl index={0} value={v1()} setValue={setV1} />
        <ColorComponentControl index={1} value={v2()} setValue={setV2} />
        <ColorComponentControl index={2} value={v3()} setValue={setV3} />
      </div>
    </div>
  );
}

export default ColorControls;
