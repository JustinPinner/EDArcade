class LoggedEvent {
    constructor(name, data) {
        this._name = name,
        this._data = data
    }
    get name() {
        return this._name;
    }
    set name(val) {
        this._name = val;
    }
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = val;
    }
    get dump() {
        return `${this._name} ${this._data}`;
    }
}