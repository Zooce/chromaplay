import { colorMode } from "./colorMode";

function ColorComponentControl(props) {
  const maxValue = () => colorMode() === "RGB" ? 255 : (props.index === 0 ? 360 : 100);

  const onInput = (event) => {
    try {
      let newValue;
      switch (colorMode()) {
        case "RGB":
          newValue = parseInt(event.target.value);
          if (newValue > 255) return;
          break;
        case "HSL":
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
    <div class="color-component-control">
      <label for={colorMode()[props.index]}>{colorMode()[props.index]}</label>
      <input type="range" min="0" max={maxValue()} value={props.value} onInput={onInput} />
      <input type="number" min="0" max={maxValue()} value={props.value} onInput={onInput} />
    </div>
  );
}

export default ColorComponentControl;
