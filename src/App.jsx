import styles from "./App.module.css";
import { createSignal } from "solid-js";

const [colorMode, setColorMode] = createSignal("RGB");

function ColorComponentControl(props) {
  const maxValue = () => colorMode() === "RGB" ? 255 : (props.index === 0 ? 360 : 100);

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

  const backgroundColor = () => {
    switch (colorMode()) {
      case 'RGB': return `rgb(${v1()}, ${v2()}, ${v3()})`;
      case 'HSL': return `hsl(${v1()}, ${v2()}%, ${v3()}%)`;
    }
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
