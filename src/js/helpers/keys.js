export const keyCodes = {
  ENTER: 13,
  SPACE: 32,
  TAB: 9,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37
}

export const getKeypress = (event) => {
  let keypress;

  for (const [key, value] of Object.entries(keyCodes)) {
    if (value === event.keyCode) {
      keypress = key;
    }
  }

  return keypress;
}