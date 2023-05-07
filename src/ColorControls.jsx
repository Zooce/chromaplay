import { createSignal, createMemo, createEffect, untrack, Show } from "solid-js";
import ColorComponentControl from "./ColorComponentControl";
import { RGB, HSL, colorMode, globalBackgroundColor, showControls } from "./global";
import { rgbToHsl, hslToRgb, hexToRgb, hexToHsl, calcContrastRatio } from "./colorUtils";
import styles from "./ColorControls.module.css";

function ColorControls(props) {
  const initialColor = props.initialColor;

  const [x, y, z] = initialColor ? (colorMode() === RGB ? hexToRgb(initialColor) : hexToHsl(initialColor)) : [0, 0, 0];

  const [v1, setV1] = createSignal(x);
  const [v2, setV2] = createSignal(y);
  const [v3, setV3] = createSignal(z);

  // recalculate the values whenever `colorMode` changes
  createEffect((prevColorMode) => {
    if (prevColorMode === colorMode()) {
      return;
    }
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
    return colorMode();
  }, colorMode());

  // update the background color whenever a color component value changes
  const backgroundColor = createMemo(() => {
    const x = v1(), y = v2(), z = v3();
    let bg;
    switch (untrack(colorMode)) {
      case RGB: bg = `rgb(${x}, ${y}, ${z})`; break;
      case HSL: bg = `hsl(${x}, ${y}%, ${z}%)`; break;
    }
    let style = { "background-color": bg };
    if (props.selected && props.selected()) {
      style = { ...style, "outline": "dodgerblue solid 3px", "outline-offset": "0.1rem" };
    }
    return style;
  });

  const colorClick = () => { if (props.selected) props.setSelected(!props.selected()); };

  // update the hex value whenever a color component value changes
  const hex = () => {
    let color = [v1(), v2(), v3()];
    if (untrack(colorMode) === HSL) {
      color = hslToRgb(...color)
    }
    const hexColor = `#${color.map(c => c.toString(16).padStart(2, 0)).join('')}`;
    if (props.setBackgroundColor) {
      props.setBackgroundColor(hexColor);
    }
    return hexColor;
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

  const [contrastRatio, setContrastRatio] = createSignal(0);
  createEffect(() => {
    let rgb1 = [v1(), v2(), v3()];
    let rgb2 = hexToRgb(globalBackgroundColor());
    if (untrack(colorMode) === HSL) {
      rgb1 = hslToRgb(...rgb1)
    }
    const cr = calcContrastRatio(rgb1, rgb2);
    setContrastRatio((Math.floor(cr * 100) / 100).toFixed(2));
  });

  const contrastRatioStyle = () => {
    const cr = contrastRatio();
    return { color: cr >= 7 ? '#00ff91' : (cr >= 3 ? 'white' : '#ff003d')};
  };

  return (
    <div class={styles.ColorControls}>
      <div class={styles.ColorBlock} style={backgroundColor()} onClick={colorClick}></div>
      <Show when={showControls() || props.initialColor}>
        <div class={styles.InfoLine}>
          <input class={styles.HexInput} type="text" maxlength="7" value={hex()} onInput={hexInput} />
          <div class={styles.ContrastRatio}>
            <span style={contrastRatioStyle()}>{contrastRatio()}</span>
            <span>:1</span>
          </div>
        </div>
        <div style={{"padding-bottom": "0.5rem"}}>
          <ColorComponentControl index={0} value={v1()} setValue={setV1} />
          <ColorComponentControl index={1} value={v2()} setValue={setV2} />
          <ColorComponentControl index={2} value={v3()} setValue={setV3} />
        </div>
      </Show>
    </div>
  );
}

export default ColorControls;
