const listenerTypes = {
  INPUT: 'input',
  CLICK: 'click',
  RESET: 'reset',
  CHANGE: 'change',
  CHECKED: 'checked',
  FOCUS: 'focus',
  BLUR: 'blur'
}

const fieldSupportedListenerTypes = {
  all: Object.values(listenerTypes),
  text: [
    listenerTypes.CHANGE,
    listenerTypes.INPUT,
    listenerTypes.RESET,
    listenerTypes.FOCUS,
    listenerTypes.BLUR,
  ],
  number: [
    listenerTypes.CHANGE,
    listenerTypes.INPUT,
    listenerTypes.RESET,
    listenerTypes.FOCUS,
    listenerTypes.BLUR,
  ],
  radio: [
    listenerTypes.CHANGE,
    listenerTypes.CHECKED,
    listenerTypes.RESET,
  ],
  checkbox: [
    listenerTypes.CHANGE,
    listenerTypes.CHECKED,
    listenerTypes.RESET,
  ],
}

const VALUE = 'value';
const CHECKED = 'checked'

const fieldValueAccessor = {
  text: VALUE,
  number: VALUE,
  radio: CHECKED,
  checkbox: CHECKED
}


export {
  fieldSupportedListenerTypes,
  listenerTypes,
  fieldValueAccessor,
}

