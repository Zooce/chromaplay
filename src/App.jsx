import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack, onMount, createEffect } from "solid-js";
import { RGB, HSL, setColorMode, globalBackgroundColor, setGlobalBackgroundColor, showControls, setShowControls } from "./global";
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

  let backgroundColorButton;
  const [showBackgroundColor, setShowBackgroundColor] = createSignal(false);
  const toggleBackgroundColorControls = () => {
    setShowBackgroundColor(!showBackgroundColor());
  }

  createEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = globalBackgroundColor();
  });

  return (
    <div class={styles.App}>
      <div class={styles.GlobalControls} style={{"background-color": globalBackgroundColor()}}>
        <select onChange={(event) => setColorMode(event.target.value)}>
          <option value={RGB} selected>{RGB}</option>
          <option value={HSL}>{HSL}</option>
        </select>
        <button onClick={addColor}>Add Color</button>
        <button ref={deleteButton} onClick={deleteSelected} disabled>Delete Selected</button>
        <button ref={backgroundColorButton} onClick={toggleBackgroundColorControls}>
          {showBackgroundColor() ? 'Hide' : 'Show'} Background Color
        </button>
        <button onClick={() => setShowControls(!showControls())}>{showControls() ? 'Hide' : 'Show'} Controls</button>
      </div>
      <div class={styles.Colors}>
        <For each={colors()}>{(color, i) =>
          <div id={`color_${color.id}`}>
            <ColorControls index={i()} selected={color.selected} setSelected={color.setSelected} />
          </div>
        }</For>
      </div>
      <Show when={showBackgroundColor()}>
        <Portal>
          <div class={styles.PortalContainer}>
            <div class={styles.BackgroundColorPopup}>
              <ColorControls initialColor={globalBackgroundColor()} setBackgroundColor={setGlobalBackgroundColor} />
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
}

export default App;
