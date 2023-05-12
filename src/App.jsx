import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack, onMount, createEffect, createMemo } from "solid-js";
import {
  RGB, HSL, colorMode, setColorMode, globalBackgroundColor,
  setGlobalBackgroundColor, showControls, setShowControls
} from "./global";
import { v4 as uuid } from "uuid";

function App() {
  const [colors, setColors] = createSignal([], {
    equals: false,
  });

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
  const swapSelected = () => {
    const newColors = untrack(colors);
    const selected = newColors.reduce((p, c, i) => {
      if (!c.selected()) return p;
      c.setSelected(false);
      p.push({ c, i });
      return p;
    }, []);
    newColors.splice(selected[0].i, 1, selected[1].c);
    newColors.splice(selected[1].i, 1, selected[0].c);
    setColors(newColors);
  };

  onMount(() => {
    addColor();
  });

  const colorsSelected = createMemo(() => colors().some(c => c.selected()));

  let deleteButton;
  createEffect(() => {
    if (colorsSelected()) {
      deleteButton.removeAttribute('disabled');
    } else {
      deleteButton.setAttribute('disabled', '');
    }
  });
  const deleteDisabled = createMemo(() => {
    if (colorsSelected()) {
      return { opacity: 1.0 };
    } else {
      return { opacity: 0.4 };
    }
  });

  const twoColorsSelected = createMemo(() => colors().filter(c => c.selected()).length === 2);
  let swapButton;
  createEffect(() => {
    if (twoColorsSelected()) {
      swapButton.removeAttribute('disabled');
    } else {
      swapButton.setAttribute('disabled', '');
    }
  });
  const swapDisabled = createMemo(() => {
    if (twoColorsSelected()) {
      return { opacity: 1.0 };
    } else {
      return { opacity: 0.4 };
    }
  });

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
      <div class={styles.GlobalControls} style={{ "background-color": globalBackgroundColor() }}>
        <button onClick={() => setColorMode(colorMode() === RGB ? HSL : RGB)}>
          <img src="src/assets/palette_FILL0_wght400_GRAD0_opsz48.svg" alt="color mode" />
        </button>
        <button onClick={addColor}>
          <img src="src/assets/add_FILL0_wght400_GRAD0_opsz48.svg" alt="add" />
        </button>
        <button ref={deleteButton} onClick={deleteSelected} disabled>
          <img style={deleteDisabled()} src="src/assets/delete_FILL0_wght400_GRAD0_opsz48.svg" alt="delete" />
        </button>
        <button onClick={toggleBackgroundColorControls}>
          <img src="src/assets/format_color_fill_FILL0_wght400_GRAD0_opsz48.svg" alt="background color" />
        </button>
        <button onClick={() => setShowControls(!showControls())}>
          <img src="src/assets/tune_FILL0_wght400_GRAD0_opsz48.svg" alt="swap" />
        </button>
        <button ref={swapButton} onClick={swapSelected} disabled>
          <img style={swapDisabled()} src="src/assets/autorenew_FILL0_wght400_GRAD0_opsz48.svg" alt="swap" />
        </button>
      </div>
      <div class={styles.Colors}>
        <For each={colors()}>{(color, i) =>
          <ColorControls id={`color_${color.id}`} index={i()} selected={color.selected} setSelected={color.setSelected} />
        }</For>
      </div>
      <Show when={showBackgroundColor()}>
        <Portal>
          <div class={styles.BackgroundColorPopup}>
            <ColorControls initialColor={globalBackgroundColor()} setBackgroundColor={setGlobalBackgroundColor} />
          </div>
        </Portal>
      </Show>
    </div>
  );
}

export default App;
