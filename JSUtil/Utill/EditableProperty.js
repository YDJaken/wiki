/**
 * @Author DY
 */

export default class EditableProperty {
    constructor(type, value, action) {
        this.type = type;
        this.value = value;
        this.action = action;
    }

    setType(type) {
        this.type = type;
    }

    setValue(value) {
        this.value = value;
    }

    setAction(action) {
        this.action = action;
    }

    toArray() {
        return [this.type, this.value, this.action];
    }
}
