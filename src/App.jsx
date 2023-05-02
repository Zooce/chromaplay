import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack } from "solid-js";

import { setColorMode } from "./colorMode";

function App() {
  const [colorIds, _setColorIds] = createSignal([0, 1]);
  const addColor = () => setColorIds([...untrack(colorIds), untrack(colorIds).length]);
  return (
    <div class={styles.App}>
      <select onChange={(event) => setColorMode(event.target.value)}>
        <option value="RGB" selected>RGB</option>
        <option value="HSL">HSL</option>
      </select>
        <button onClick={addColor}>Add Color</button>
        <For each={colorIds()}>{(id, _i) =>
          <div id={`color${id}`}>
            <ColorControls />
          </div>
        }</For>
    </div>
  );
}

export default App;
