import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack, onMount, createEffect } from "solid-js";

import { setColorMode } from "./colorMode";
import { v4 as uuid } from "uuid";

function App() {
  const [colors, setColors] = createSignal([]);

  const addColor = () => {
    const [selected, setSelected] = createSignal(false);
    const newColor = {
      id: uuid(),
      selected,
      setSelected,
    };
    setColors([...untrack(colors), newColor]);
  };

  const deleteSelected = () => setColors(colors().filter(c => !c.selected()));

  onMount(() => {
    addColor();
  });

  let deleteButton;
  createEffect(() => {
    if (colors().some(c => c.selected())) {
      deleteButton.removeAttribute('disabled');
    } else {
      deleteButton.setAttribute('disabled', '');
    }
  });

  return (
    <div class={styles.App}>
      <div class={styles.GlobalControls}>
        <select onChange={(event) => setColorMode(event.target.value)}>
          <option value="RGB" selected>RGB</option>
          <option value="HSL">HSL</option>
        </select>
        <button onClick={addColor}>Add Color</button>
        <button ref={deleteButton} onClick={deleteSelected} disabled>Delete Selected</button>
      </div>
      <div class={styles.Colors}>
        <For each={colors()}>{(color, i) =>
          <div id={`color_${color.id}`}>
            <ColorControls index={i()} selected={color.selected} setSelected={color.setSelected} />
          </div>
        }</For>
      </div>
    </div>
  );
}

export default App;
