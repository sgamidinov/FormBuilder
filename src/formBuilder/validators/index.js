export default class Validators {
  static Required() {
    return value => {
      if (typeof value !== 'string') return false;
      return String(value).trim().length > 0;
    };
  }

  static maxLength(length) {
    return value => {
      return String(value).length <= length;
    }
  }

  static minLength(length) {
    return value => {
      return String(value).length >= length;
    }
  }

  static mustBeChecked() {
    return value => {
      return value;
    }
  }

  static maxValue(limit) {
    return value => {
      const number = parseInt(value);
      if (Number.isNaN(number)) return false;
      return number <= limit;
    }
  }
}


