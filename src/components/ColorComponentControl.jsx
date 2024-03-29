import styles from "./ColorComponentControl.module.css";
import { RGB, HSL, colorMode } from "../utils/global";
import { createMemo } from "solid-js";

export default function ColorComponentControl(props) {
  const maxValue = createMemo(() => colorMode() === RGB ? 255 : (props.index === 0 ? 360 : 100));
  const label = createMemo(() => colorMode()[props.index]);

  const onInput = (event) => {
    try {
      let newValue;
      switch (colorMode()) {
        case RGB:
          newValue = parseInt(event.target.value);
          if (newValue > 255) return;
          break;
        case HSL:
          if (props.index === 0) {
            newValue = parseInt(event.target.value);
            if (newValue > 360) return;
          } else {
            newValue = parseFloat(event.target.value);
            if (newValue > 100) return;
          }
          break;
      }
      if (isNaN(newValue) || newValue < 0) return;
      props.setValue(newValue);
    } catch {
      // ignore mad values
    }
  }

  return (
    <div class={styles.ColorComponentControl}>
      <label for={label()}>{label()}</label>
      <input type="range" min="0" max={maxValue()} value={props.value} onInput={onInput} aria-label={`${label()} component slider`}/>
      <input type="number" min="0" max={maxValue()} value={props.value} onInput={onInput} aria-label={`${label()} component number input`} />
    </div>
  );
}
