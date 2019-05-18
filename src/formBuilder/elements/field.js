import {fieldSupportedListenerTypes, fieldValueAccessor} from "../shared/constants";
import {capitalize, compose, noop} from "../utils";

const defaultConfiguration = {
    validators: [],
    validClassName: 'valid',
    invalidClassName: 'invalid',
    errorContainerSelector: '.errors',
    errorMessageFormatter: msg => `<p style="color: red;">${msg}</p>`,
};

const defaultHooks = {
    input: noop,
    change: noop,
    error: noop,
    blur: noop,
    focus: noop,
    reset: noop,
    destroy: noop,
    valid: noop,
    init: noop,
};

class Field {
    constructor({name, configuration, value}) {
        this.configuration = {...defaultConfiguration, ...configuration};
        this.name = name;
        this.fieldNode = document.querySelector(`[name="${name}"]`);

        if (!this.fieldNode) {
            throw new Error('Field element does\'not exist');
        }

        this.hooks = {...defaultHooks, ...configuration.hooks};
        this.type = this.fieldNode.getAttribute('type') || 'text';
        this.valueAccessor = fieldValueAccessor[this.type];
        this.validators = this.configuration.validators;
        this.valid = null;
        this.dirty = null;
        this.touched = null;
        this._value = this.fieldNode[this.valueAccessor];
        this.defaultValue = value || this.value;
        this.invalid = null;
        this.parent = null;
        this.focus = false;
        this.errors = [];
        this.pipes = (compose.apply(null, this.configuration.pipes)).bind(this);
        this.errorContainer = this.fieldNode.parentElement.querySelector(this.configuration.errorContainerSelector);
        this.attachListeners();

        if (value) {
            this.value = value;
        }

        this.hooks.init(this);
    }

    get value() {
        return this._value || this.defaultValue;
    }

    set value(value) {
        this._value = value;
        this.fieldNode[this.valueAccessor] = this._value;
    }

    setParent(parent) {
        this.parent = parent;
        this.hooks.change(null, this);
    }

    attachListeners() {
        if (!fieldSupportedListenerTypes[this.type]) return;
        for (let listenerType of fieldSupportedListenerTypes[this.type]) {
            const eventMethod = 'on' + capitalize(listenerType);
            if (!this[eventMethod]) continue;
            this[eventMethod] = this[eventMethod].bind(this);
            this.fieldNode.addEventListener(listenerType, this[eventMethod], true);
        }
    }

    detachListeners() {
        if (!fieldSupportedListenerTypes[this.type]) return;
        for (let listenerType of fieldSupportedListenerTypes[this.type]) {
            const eventMethod = 'on' + capitalize(listenerType);
            if (!this[eventMethod]) continue;
            this.fieldNode.removeEventListener(listenerType, this[eventMethod], true);
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

        this.invalid ? this.renderErrors() : this.clearErrors();

        if (this.parent) {
            this.parent.validate();
        }

        if (this.validators.length > 0) {
            this.fieldNode.classList[this.valid ? 'add' : 'remove'](this.configuration.validClassName);
            this.fieldNode.classList[this.invalid ? 'add' : 'remove'](this.configuration.invalidClassName);
        }

        this.valid ? this.onValid() : this.onError();
    }

    runPipes(value) {
        if (this.pipes) {
            return this.pipes(value);
        }

        return value;
    }

    onChange(event) {
        this.dirty = true;
        const oldValue = this.value;
        const newValue = this.runPipes(this.fieldNode[this.valueAccessor]);
        this.value = newValue;

        if (oldValue !== newValue) {
            this.validate();
        }

        this.hooks.change(event, this);
    }

    onFocus(event) {
        this.touched = true;
        this.focus = true;
        this.hooks.focus(event, this);
    }

    onBlur(event) {
        this.focus = false;
        this.hooks.blur(event, this);
    }

    onInput(event) {
        this.dirty = true;
        this.value = this.runPipes(this.fieldNode[this.valueAccessor]);
        this.validate();
        this.hooks.input(event, this);
    }

    renderErrors() {
        if (!this.errorContainer) return;
        this.errorContainer.innerHTML = this.errors.map(msg => this.configuration.errorMessageFormatter(msg)).join('')
    }

    clearErrors() {
        if (!this.errorContainer) return;
        this.errorContainer.innerHTML = '';
    }

    onError(event) {
        this.hooks.error(event, this);
    }

    onValid() {
        this.hooks.valid(this);
    }

    destroy() {
        this.fieldNode.remove();
        this.detachListeners();

        if (this.parent && this.parent.destroyField) {
            this.parent.destroyField(this);
        }

        this.hooks.destroy();
    }

    reset() {
        this.value = this.defaultValue;
        this.fieldNode[this.valueAccessor] = this.value;
        this.clearErrors();
        this.valid = null;
        this.invalid = null;
        this.touched = null;
        this.dirty = null;
        this.hooks.reset(this);
    }
}

export default Field;
