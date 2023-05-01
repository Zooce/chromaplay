import styles from "./App.module.css";
import ColorControls from "./ColorControls";

import { setColorMode } from "./colorMode";

function App() {
  return (
    <div class={styles.App}>
      <select onChange={(event) => setColorMode(event.target.value)}>
        <option value="RGB">RGB</option>
        <option value="HSL">HSL</option>
      </select>
      <ColorControls />
    </div>
  );
}

export default App;
