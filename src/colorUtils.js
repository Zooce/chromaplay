export const rgbToHsl = (r, g, b) => {
  // normalize RGB values
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;

  // find min and max values
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);

  let h, s, l;

  // calculate hue
  if (max === min) {
    h = 0;
  } else if (max === nr) {
    h = ((60 * ((ng - nb) / (max - min)) % 360) + 360) % 360;
  } else if (max === ng) {
    h = 60 * ((nb - nr) / (max - min)) + 120;
  } else {
    h = 60 * ((nr - ng) / (max - min)) + 240;
  }

  // calculate lightness
  l = (max + min) / 2;

  // calculate saturation
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = (max - min) / (max + min);
  } else {
    s = (max - min) / (2 - max - min);
  }

  // convert hue to degrees
  h = Math.round(h);

  // convert saturation and lightness to percentages
  s = parseFloat((s * 100).toFixed(1));
  l = parseFloat((l * 100).toFixed(1));

  return [h, s, l];
}

export const hslToRgb = (h, s, l) => {
  // convert saturation and lightness to decimals
  const sn = s / 100;
  const ln = l / 100;

  let c = (1 - Math.abs(2 * ln - 1)) * sn;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = ln - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  // normalize RGB values and convert to integers
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

export const hexToRgb = (hexColor) => [
  parseInt(hexColor.substring(1, 3), 16),
  parseInt(hexColor.substring(3, 5), 16),
  parseInt(hexColor.substring(5), 16)
];

export const hexToHsl = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  return rgbToHsl(...rgb);
}

export const relativeLuminance = (r, g, b) => {
  // ref: https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const S = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * S(r) + 0.7152 * S(g) + 0.0722 * S(b) + 0.05;
};

export const calcContrastRatio = (rgb1, rgb2) => {
  // ref: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
  // ref: https://www.w3.org/TR/WCAG20-TECHS/G17.html
  // black === 0.05
  // white === 1.05
  const L1 = relativeLuminance(...rgb1);
  const L2 = relativeLuminance(...rgb2);
  return L1 > L2 ? L1 / L2 : L2 / L1;
};
