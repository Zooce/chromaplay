import { createMemo, untrack, Show } from "solid-js";
import ColorComponentControl from "./ColorComponentControl";
import { RGB, HSL, colorMode, globalBackgroundColor, showControls } from "./global";
import { rgbToHsl, hslToRgb, hexToRgb, hexToHsl, calcContrastRatio } from "./colorUtils";
import styles from "./ColorControls.module.css";

const toHex = (a, b, c) => {
  let color = [a, b, c];
  if (untrack(colorMode) === HSL) {
    color = hslToRgb(...color);
  }
  return `#${color.map((n) => n.toString(16).padStart(2, 0)).join("")}`;
};

export default function ColorControls(props) {
  const components = createMemo(() => colorMode() === RGB ? hexToRgb(props.value) : hexToHsl(props.value));

  const publish = (a, b, c) => {
    const hexColor = toHex(a, b, c);
    if (props.setBackgroundColor != null) props.setBackgroundColor(hexColor);
    if (props.setValue != null) props.setValue(hexColor);
  };

  const backgroundColor = createMemo(() => {
    const style = { "background-color": props.value };
    if (props.selected) {
      style.outline = "dodgerblue solid 3px";
      style["outline-offset"] = "0.1rem";
    }
    return style;
  });

  const colorClick = () => { if (props.setSelected) props.setSelected(!props.selected); };

  const hexInput = (event) => {
    let newHex = event.target.value;
    if (newHex.length === 6 && !newHex.startsWith('#')) {
      newHex = `#${newHex}`;
    } else if (newHex.length !== 7) {
      return;
    }
    try {
      const canonical = toHex(...(untrack(colorMode) === HSL ? rgbToHsl(...hexToRgb(newHex)) : hexToRgb(newHex)));
      if (props.setBackgroundColor != null) props.setBackgroundColor(canonical);
      if (props.setValue != null) props.setValue(canonical);
    } catch {
      // invalid hex color input - just ignore it
    }
  }

  const contrastRatio = createMemo(() => {
    const rgb1 = hexToRgb(props.value);
    const rgb2 = hexToRgb(globalBackgroundColor());
    const cr = calcContrastRatio(rgb1, rgb2);
    return (Math.floor(cr * 100) / 100).toFixed(2);
  });

  const contrastRatioStyle = () => {
    const cr = contrastRatio();
    return { color: cr >= 7 ? '#00ff91' : (cr >= 3 ? 'white' : '#ff003d') };
  };

  return (
    <div class={styles.ColorControls}>
      <Show when={props.index != undefined}>
        <div class={styles.ColorBlock} style={backgroundColor()} onClick={colorClick}></div>
      </Show>
      <Show when={showControls() || props.always != undefined}>
        <div class={styles.ControlsContainer}>
          <div class={styles.InfoLine}>
            <input class={styles.HexInput} name={`hex-${props.index}`} type="text" maxlength="7" value={props.value} onInput={hexInput} aria-label="hex input" />
            <div class={styles.ContrastRatio}>
              <span style={contrastRatioStyle()}>{contrastRatio()}</span>
              <span>:1</span>
            </div>
          </div>
          <div class={styles.Sliders}>
            <ColorComponentControl id={`${props.id}-0`} index={0} value={components()[0]} setValue={(n) => publish(n, components()[1], components()[2])} />
            <ColorComponentControl id={`${props.id}-1`} index={1} value={components()[1]} setValue={(n) => publish(components()[0], n, components()[2])} />
            <ColorComponentControl id={`${props.id}-2`} index={2} value={components()[2]} setValue={(n) => publish(components()[0], components()[1], n)} />
          </div>
        </div>
      </Show>
    </div>
  );
}
