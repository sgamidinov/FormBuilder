import Field from './field'

class Group {
    constructor({fields}) {
        this.fields = {};
        this._valid = null;

        this.setFields(fields);
    }

    set valid(value) {
        this._valid = value;
    }

    get valid() {
        return this._valid;
    }

    get value() {

    }

    set value(value) {

    }

    setFields(fields) {
        for (const fieldKey in fields) {
            const field = fields[fieldKey];
            const constructed = field.constructor === Field ? field : new Field(field);
            constructed.setParent(this);
            this.fields[fieldKey] = constructed;
        }
    }

    validate() {
        this.valid = true;

        for (const fieldName in this.fields) {
            if (!this.fields[fieldName].valid) {
                this.valid = false;
            }
        }

        console.log(this.valid, 'group')
    }

    reset() {

    }

}

export default Group;
