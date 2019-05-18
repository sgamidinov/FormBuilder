import "./styles.css";
import {FormField, Validators} from "./formBuilder";
import compose from './formBuilder/utils/compose'

const field = new FormField({
    name: 'age',
    configuration: {
        errorClass: 'invalid',
        middlewares: [
            value => {
                return value.replace(/(\d{4}(?!\s))/g, "$1 ")
            },
            value => {
                if (value.length > 20) return value.slice(0, 20);
                return value
            }
        ],
        validators: [
            {
                rule: Validators.Required(),
                message: 'This field is required and must be filled out!!!'
            },
            {
                rule: Validators.maxLength(20),
                message: 'Max possible length is 20'
            },
            {
                rule: Validators.onlyNumbers(),
                message: 'Field requires only numbers'
            },
            {
                rule: Validators.bankCardNumber(),
                message: 'Wrong bank card number'
            }
        ],
        onError: function () {
            console.log('errored')
        }
    }
});

const agreement = new FormField({
    name: 'agreement',
    configuration: {
        validators: [
            {
                rule: Validators.mustBeChecked(),
                message: 'Check this box out'
            }
        ]
    }
});

function f1(val) {
    return val + ' f1'
}

function f2(val) {
    return val + ' f2'
}

const composed = compose(f1, f2);

console.log(composed('meow'));
