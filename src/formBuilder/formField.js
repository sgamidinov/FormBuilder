import {fieldSupportedListenerTypes, fieldValueAccessor} from './shared/constants';
import {noop} from "./utils";
import Capitalize from './utils/capitalize'
import Compose from './utils/compose'

const defaultConfiguration = {
    validators: [],
    validClassName: 'valid',
    invalidClassName: 'invalid',
    errorContainerSelector: '.errors',
    onError: noop,
    onValid: noop,
    errorMessageFormatter: msg => `<p style="color: red;">${msg}</p>`,
};

class FormField {
    constructor({name, configuration}) {
        this.configuration = Object.assign({}, defaultConfiguration, configuration);
        this.name = name;
        this.fieldNode = document.querySelector(`input[name="${name}"]`);

        if (!this.fieldNode) {
            throw new Error('Field element does\'not exist');
        }

        this.type = this.fieldNode.getAttribute('type') || 'text';
        this.valueAccessor = fieldValueAccessor[this.type];
        this.validators = this.configuration.validators;
        this.valid = null;
        this.dirty = null;
        this.touched = null;
        this._value = this.fieldNode[this.valueAccessor];
        this.defaultValue = this.value;
        this.invalid = null;
        this.parent = null;
        this.focus = false;
        this.errors = [];
        this.middleware = Compose.apply(null, this.configuration.middlewares);
        this.errorContainer = this.fieldNode.parentElement.querySelector(this.configuration.errorContainerSelector);
        this.attachListeners();
    }

    get value() {
        return this._value || this.defaultValue;
    }

    set value(value) {
        if (typeof value === 'string') {
            this._value = value.trim();
        } else {
            this._value = value;
        }

        this.fieldNode[this.valueAccessor] = this._value;
    }

    setParent(parent) {
        this.parent = parent;
    }

    attachListeners() {
        if (!fieldSupportedListenerTypes[this.type]) return;
        for (let listenerType of fieldSupportedListenerTypes[this.type]) {
            const eventMethod = 'on' + Capitalize(listenerType);
            if (!this[eventMethod]) continue;
            this.fieldNode.addEventListener(listenerType, event => {
                this[eventMethod](event);
            });
        }
    }

    validate() {
        this.errors = [];
        this.valid = true;
        this.invalid = false;

        for (let validator of this.validators) {
            if (!validator.rule(this._value)) {
                this.errors.push(validator.message);
                this.valid = false;
                this.invalid = true;
            }
        }

        if (this.invalid) {
            this.renderErrors();
        } else {
            this.clearErrors();
        }

        if (this.parent) {
            this.parent.validate();
        }

        this.fieldNode.classList[this.valid ? 'add' : 'remove'](this.configuration.validClassName);
        this.fieldNode.classList[this.invalid ? 'add' : 'remove'](this.configuration.invalidClassName);
        this.valid ? this.onValid() : this.onError();
    }

    runMiddleware(value) {
        if (this.middleware) {
            return this.middleware.call(this, value)
        }

        return value;
    }

    onChange(event) {
        this.dirty = true;
        this.value = this.runMiddleware(this.fieldNode[this.valueAccessor]);
        this.validate();
    }

    onFocus(event) {
        this.touched = true;
        this.focus = true;
    }

    onBlur() {
        this.focus = false;
    }

    onInput(event) {
        this.dirty = true;
        this.value = this.runMiddleware(this.fieldNode[this.valueAccessor]);
        this.validate();
    }

    renderErrors() {
        if (!this.errorContainer) return;
        this.errorContainer.innerHTML = this.errors.map(msg => this.configuration.errorMessageFormatter(msg)).join('')
    }

    clearErrors() {
        if (!this.errorContainer) return;
        this.errorContainer.innerHTML = '';
    }

    onError() {
        this.configuration.onError.call(this);
    }

    onValid() {
        this.configuration.onValid.call(this);
    }

    destroy() {
        this.fieldNode.remove();

        if (this.parent) {
            this.parent.destroyField(this);
        }
    }

    reset() {
        this.value = this.defaultValue;
        this.fieldNode[this.valueAccessor] = this.value;
        this.clearErrors();
        this.valid = null;
        this.invalid = null;
        this.touched = null;
        this.dirty = null;
    }
}

export default FormField;
