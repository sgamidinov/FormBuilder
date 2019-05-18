import "./styles.css";
import {Field, Group, Validators} from "./formBuilder";
import capitalize from "./formBuilder/utils/capitalize";

const field = new Field({
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

const agreement = new Field({
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


const comment = new Field({
    name: 'comment',
    configuration: {
        middlewares: [
            value => value.toUpperCase(),
        ],
        validators: [
            {
                rule: Validators.Required(),
                message: 'Fill out this textarea'
            },
            {
                rule: Validators.maxLength(72),
                message: 'Make your message shorter'
            }
        ]
    }
});


const fullName = new Group({
    fields: {
        firstname: {
            name: 'firstname',
            configuration: {
                middlewares: [
                    value => {
                        return capitalize(value)
                    }
                ],
                validators: [
                    {
                        rule: Validators.Required(),
                        message: 'Cannot be empty'
                    }
                ]
            }
        },
        lastName: new Field({
            name: 'lastname',
            configuration: {
                middlewares: [
                    value => {
                        return capitalize(value)
                    }
                ],
                validators: [
                    {
                        rule: Validators.Required(),
                        message: 'Cannot be empty'
                    },
                    {
                        rule: Validators.maxLength(18),
                        message: 'Make your message shorter'
                    }
                ]
            }
        })
    }
});

const fval = document.querySelector('.fval')
const frequency = new Field({
    name: 'frequency',
    configuration: {
        middlewares: [
            value => parseInt(value),
        ],
        validators: [
            {
                rule: Validators.minValue(4),
                message: 'Max possible value is 40'
            },
            {
                rule: Validators.maxValue(40),
                message: 'Max possible value is 40'
            },
        ],
        onValid() {
            fval.innerHTML = this.value
        }
    }
});

console.log(frequency)

// console.log(fullName)
