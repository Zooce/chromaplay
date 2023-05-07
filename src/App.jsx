import styles from "./App.module.css";
import ColorControls from "./ColorControls";
import { createSignal, untrack, onMount, createEffect } from "solid-js";
import { RGB, HSL, setColorMode, globalBackgroundColor, setGlobalBackgroundColor, showControls, setShowControls } from "./global";
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

  let deleteButton;
  createEffect(() => {
    if (colors().some(c => c.selected())) {
      deleteButton.removeAttribute('disabled');
    } else {
      deleteButton.setAttribute('disabled', '');
    }
  });

  let swapButton;
  createEffect(() => {
    if (colors().filter(c => c.selected()).length === 2) {
      swapButton.removeAttribute('disabled');
    } else {
      swapButton.setAttribute('disabled', '');
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
        <button ref={swapButton} onClick={swapSelected} disabled>Swap Selected</button>
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
