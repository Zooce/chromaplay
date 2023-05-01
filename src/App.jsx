import styles from "./App.module.css";
import { createSignal, createMemo, createEffect, untrack } from "solid-js";

const [colorMode, setColorMode] = createSignal("RGB");

function ColorComponentControl(props) {
  const maxValue = () => colorMode() === "RGB" ? 255 : (props.index === 0 ? 360 : 100);

  // const validateValue = (value) => {
  //   if (isNaN(newValue) || newValue < 0) return false;
  //   switch (colorMode()) {
  //     case "RGB":
  //       if (newValue > 255) return false;
  //       break;
  //     case "HSL":
  //       if ((props.index === 0 && newValue > 360) || (props.index !== 0 && newValue > 100)) return false;
  //       break;
  //   }
  //   return true;
  // }

  const onNumberInput = (e) => {
    try {
      const newValue = parseInt(e.target.value);
      if (isNaN(newValue) || newValue < 0) return;
      switch (colorMode()) {
        case "RGB":
          if (newValue > 255) return;
          break;
        case "HSL":
          if ((props.index === 0 && newValue > 360) || (props.index !== 0 && newValue > 100)) return;
          break;
      }
      props.setValue(newValue);
    } catch {
      // ignore bad values
    }
  }
  return (
    <div class="color-component-control">
      <label for={colorMode()[props.index]}>{colorMode()[props.index]}</label>
      <input type="range" min="0" max={maxValue()} value={props.value} onInput={(e) => props.setValue(e.target.value)} />
      <input type="number" min="0" max={maxValue()} value={props.value} onInput={onNumberInput} />
    </div>
  );
}

function ColorControls() {
  const [v1, setV1] = createSignal(0);
  const [v2, setV2] = createSignal(0);
  const [v3, setV3] = createSignal(0);

  // recalculate the values whenever `colorMode` changes
  createEffect(() => {
    if (colorMode() === 'RGB') {
      const { r, g, b } = hslToRgb(untrack(v1), untrack(v2), untrack(v3));
      setV1(r);
      setV2(g);
      setV3(b);
    } else {
      const { h, s, l } = rgbToHsl(untrack(v1), untrack(v2), untrack(v3));
      setV1(h);
      setV2(s);
      setV3(l);
    }
  });

  const backgroundColor = createMemo(() => {
    const x = v1(), y = v2(), z = v3();
    switch (colorMode()) {
      case 'RGB': return `rgb(${x}, ${y}, ${z})`;
      case 'HSL': return `hsl(${x}, ${y}%, ${z}%)`;
    }
  });

  const rgbToHsl = (r, g , b) => {
    // normalize RGB values
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;

    // find min and max values
    const max = Math.max(nr, ng, nb);
    const min = Math.min(nr, ng, nb);

    let h, s, l;

    // calculate hue
    if (max === min) {
      h = 0;
    } else if (max === nr) {
      h = ((60 * ((ng - nb) / (max - min)) % 360) + 360) % 360;
    } else if (max === ng) {
      h = 60 * ((nb - nr) / (max - min)) + 120;
    } else {
      h = 60 * ((nr - ng) / (max - min)) + 240;
    }

    // calculate lightness
    l = (max + min) / 2;

    // calculate saturation
    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }

    // convert hue to degrees
    h = Math.round(h);

    // convert saturation and lightness to percentages
    s = parseFloat((s * 100).toFixed(1));
    l = parseFloat((l * 100).toFixed(1));

    return { h, s, l };
  }

  const hslToRgb = (h, s, l) => {
    // convert saturation and lightness to decimals
    const sn = s / 100;
    const ln = l / 100;

    let c = (1 - Math.abs(2 * ln - 1)) * sn;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = ln - c / 2;

    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    // normalize RGB values and convert to integers
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  }

  return (
    <div class="color-control-container">
      <div style={{width:`100px`,height:`100px`,"background-color":backgroundColor()}}></div>
      <input type="text" maxlength="7" value={`${v1()} ${v2()} ${v3()}`}/>
      <ColorComponentControl index={0} value={v1()} setValue={setV1} />
      <ColorComponentControl index={1} value={v2()} setValue={setV2} />
      <ColorComponentControl index={2} value={v3()} setValue={setV3} />
    </div>
  );
}

function App() {
  return (
    <div class={styles.App}>
      <select onChange={(e) => setColorMode(e.target.value)}>
        <option value="RGB">RGB</option>
        <option value="HSL">HSL</option>
      </select>
      <ColorControls />
    </div>
  );
}

export default App;
