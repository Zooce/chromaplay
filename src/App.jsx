import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack, onMount, createEffect } from "solid-js";
import { hexToRgb } from "./colorUtils";
import { RGB, HSL, setColorMode } from "./colorMode";
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

  const [backgroundColor, setBackgroundColor] = createSignal("#ffffff");
  createEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = backgroundColor();
  });

  const [textColor, setTextColor] = createSignal("#000000");
  createEffect(() => {
    // ref: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
    // ref: https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const S = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const L = (r, g, b) => 0.2126 * S(r) + 0.7152 * S(g) + 0.0722 * S(b) + 0.05;
    const Lrgb = L(...hexToRgb(backgroundColor()));
    const blkRatio = Lrgb / 0.05;
    const whtRatio = 1.05 / Lrgb;

    setTextColor(blkRatio >= whtRatio ? "#000000" : "#ffffff");
  });

  const appStyle = () => ({ color: textColor() });
  const globalControlsStyle = () => ({
    "background-color": backgroundColor(),
    "border-bottom-color": textColor(),
  });

  return (
    <div class={styles.App} style={appStyle()}>
      <div class={styles.GlobalControls} style={globalControlsStyle()}>
        <select onChange={(event) => setColorMode(event.target.value)}>
          <option value={RGB} selected>{RGB}</option>
          <option value={HSL}>{HSL}</option>
        </select>
        <button onClick={addColor}>Add Color</button>
        <button ref={deleteButton} onClick={deleteSelected} disabled>Delete Selected</button>
        <button ref={backgroundColorButton} onClick={toggleBackgroundColorControls}>
          {showBackgroundColor() ? 'Hide' : 'Show'} Background Color
        </button>
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
              <ColorControls initialColor={backgroundColor()} setBackgroundColor={setBackgroundColor} />
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
}

export default App;
