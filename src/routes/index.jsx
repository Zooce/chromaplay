import styles from "./index.module.css";
import ColorControls from "../components/ColorControls";
import { createSignal, untrack, onMount, createEffect, createMemo } from "solid-js";
import {
  RGB, HSL, colorMode, setColorMode, globalBackgroundColor,
  setGlobalBackgroundColor, showControls, setShowControls
} from "../utils/global";
import { v4 as uuid } from "uuid";

export default function Index() {
  const [colors, setColors] = createSignal([], {
    equals: false,
  });

  const createColor = (v) => {
    const [selected, setSelected] = createSignal(false);
    const [value, setValue] = createSignal(v);
    const newColor = {
      id: uuid(),
      selected,
      setSelected,
      value,
      setValue,
    };
    return newColor; 
  }
  const addColor = () => {
    setColors([...untrack(colors), createColor("#000000")]);
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

  let load;
  const loadColorPalette = (event) => {
    const target = event.target;
    const fr = new FileReader();
    fr.onload = () => {
      target.value = null; // don't need the old filename anymore
      const data = JSON.parse(fr.result);
      setGlobalBackgroundColor(data.background);
      const newColors = [];
      for (const c of data.colors) {
        newColors.push(createColor(c));
      }
      setColors(newColors);
    };
    fr.readAsText(event.target.files[0]);
  };

  let download;
  const downloadPalette = () => {
    const palette = {
      background: untrack(globalBackgroundColor),
      colors: [],
    };
    for (const c of untrack(colors)) {
      palette.colors.push(untrack(c.value));
    }
    download.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(palette))}`);
    download.click();
  };

  // NOTE: since I'm hosting this on Github Pages (@ https://zooce.github.io/chromaplay) the images must have the `/chromaplay/` prefix
  return (
    <div class={styles.App}>
      <div class={styles.GlobalControls} style={{ "background-color": globalBackgroundColor() }}>
        <button onClick={() => setColorMode(colorMode() === RGB ? HSL : RGB)} aria-label="color mode">
          <img src="/chromaplay/icons/palette_FILL0_wght400_GRAD0_opsz48.svg" alt="color mode" />
        </button>
        <button onClick={addColor} aria-label="add color">
          <img src="/chromaplay/icons/add_FILL0_wght400_GRAD0_opsz48.svg" alt="add" />
        </button>
        <button ref={deleteButton} onClick={deleteSelected} disabled aria-label="delete selected colors">
          <img style={deleteDisabled()} src="/chromaplay/icons/delete_FILL0_wght400_GRAD0_opsz48.svg" alt="delete" />
        </button>
        <button onClick={toggleBackgroundColorControls} aria-label="toggle background color controls">
          <img src="/chromaplay/icons/format_color_fill_FILL0_wght400_GRAD0_opsz48.svg" alt="background color" />
        </button>
        <button onClick={() => setShowControls(!showControls())} aria-label="toggle color controls">
          <img src="/chromaplay/icons/tune_FILL0_wght400_GRAD0_opsz48.svg" alt="swap" />
        </button>
        <button ref={swapButton} onClick={swapSelected} disabled aria-label="swap selected colors">
          <img style={swapDisabled()} src="/chromaplay/icons/autorenew_FILL0_wght400_GRAD0_opsz48.svg" alt="swap" />
        </button>
        <input ref={load} id="loadPalette" type="file" accept=".json, .toml" onChange={loadColorPalette} style={{ display: "none" }} />
        <button onClick={() => load.click()} aria-label="load color palette">
          <img src="/chromaplay/icons/upload_FILL0_wght400_GRAD0_opsz48.svg" alt="load" />
        </button>
        <a ref={download} download="chromaplay.json" style={{ display: "none" }}></a>
        <button onClick={downloadPalette} aria-label="download color palette">
          <img src="/chromaplay/icons/download_FILL0_wght400_GRAD0_opsz48.svg" alt="download" />
        </button>
      </div>
      <div class={styles.Colors}>
        <For each={colors()}>{(color, i) =>
          <ColorControls id={`color_${color.id}`} index={i()} selected={color.selected} setSelected={color.setSelected} value={color.value} setValue={color.setValue} />
        }</For>
      </div>
      <Show when={showBackgroundColor()}>
        <Portal>
          <div class={styles.BackgroundColorPopup}>
            <ColorControls value={globalBackgroundColor} setBackgroundColor={setGlobalBackgroundColor} always />
          </div>
        </Portal>
      </Show>
    </div>
  );
}
