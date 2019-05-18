import {onlyNumbers, onlyNumbersAndSpace} from "../shared/regex";

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
            return Boolean(value);
        }
    }

    static maxValue(limit) {
        return value => {
            const number = parseInt(value);
            if (Number.isNaN(number)) return false;
            return number <= limit;
        }
    }

    static minValue(limit) {
        return value => {
            const number = parseInt(value);
            if (Number.isNaN(number)) return false;
            return number >= limit;
        }
    }

    static onlyNumbers() {
        return value => {
            return onlyNumbers.test(value);
        }
    }

    static onlyNumbersAndSpace() {
        return value => {
            return onlyNumbersAndSpace.test(value);
        }
    }

    static bankCardNumber() {
        const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        const amexpRegEx = /^(?:3[47][0-9]{13})$/;
        const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

        return value => {
            let valueWithoutSpaces = value.split(' ').join('');
            let isValid = false;

            if (visaRegEx.test(valueWithoutSpaces)) {
                isValid = true;
            } else if (mastercardRegEx.test(valueWithoutSpaces)) {
                isValid = true;
            } else if (amexpRegEx.test(valueWithoutSpaces)) {
                isValid = true;
            } else if (discovRegEx.test(valueWithoutSpaces)) {
                isValid = true;
            }

            // const mastercardRegEx = /^(?:5[1-5][0-9]{2})$/

            return isValid;
        }
    }
}


