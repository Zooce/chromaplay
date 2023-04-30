import styles from './App.module.css';
import { createSignal } from 'solid-js';

const [colorMode, setColorMode] = createSignal('RGB');

function ColorComponentControl(props) {
  const [value, setValue] = createSignal(0);

  const maxValue = () => colorMode() === 'RGB' ? 255 : (props.index === 0 ? 360 : 100);

  const onNumberInput = (e) => {
    try {
      const newValue = parseInt(e.target.value);
      if (isNaN(newValue) || newValue < 0) return;
      switch (colorMode()) {
        case 'RGB':
          if (newValue > 255) return;
          break;
        case 'HSL':
          if ((props.index === 0 && newValue > 360) || (props.index !== 0 && newValue > 100)) return;
          break;
      }
      setValue(newValue);
    } catch {
      // ignore bad values
    }
  }
  return (
    <div class='color-component-control'>
      <label for={colorMode()[props.index]}>{colorMode()[props.index]}</label>
      <input type='range' min='0' max={maxValue()} value={value()} onInput={(e) => setValue(e.target.value)} />
      <input type='number' min='0' max={maxValue()} value={value()} onInput={onNumberInput} />
    </div>
  );
}

function ColorControls() {
  return (
    <div class='color-control-container'>
      <For each={[0, 1, 2]}>{(i) =>
        <ColorComponentControl index={i} />
      }</For>
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
