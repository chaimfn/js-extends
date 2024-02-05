'use strict';

const Type = {
    Undefined: undefined,
    Unknown: "unknown",
    Number: "number",
    String: "string",
    Boolean: "boolean",
    Array: "array",
    Date: "date",
    Function: "function",
    Object: "object",
    GetType: function (value) {
        if (value == null) return this.Undefined;
        if (typeof value == typeof 1) return Type.Number;
        if (typeof value == typeof "") return Type.String;
        if (typeof value == typeof true) return Type.Boolean;
        if (Array.isArray(value)) return Type.Array;
        if (!!value.getTime) return Type.Date;
        if (typeof value == typeof (() => { })) return Type.Function;
        if (typeof value == typeof {}) return Type.Object;
        return Type.Unknown;
    },
}

function formatDate(date) {
    if (date == null) return "";
    if (Type.GetType(date) != Type.Date) return undefined;

    let d = String(date.getDate());
    let m = String(date.getMonth() + 1);
    let y = String(date.getFullYear());
    let h = String(date.getHours());
    let mm = String(date.getMinutes());
    let s = String(date.getSeconds());
    let ms = String(date.getMilliseconds());

    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")} ${h.padStart(2, "0")}:${mm.padStart(2, "0")}:${s.padStart(2, "0")}.${ms.padStart(3, "0")}`;
}

const strFormat = (value) => {
    if (value == null) return null;

    switch (Type.GetType(value)) {
        case Type.Date:
            return `'${formatDate(value)}'`;;

        case Type.Function:
            return value.shortString();

        case Type.String:
            return `'${value}'`;

        default:
            return value.toString()
    }
}

Date.prototype.equals = function (date) {
    if (date == null) return false;
    if (Type.GetType(date) != Type.Date) return false;

    return this.getTime() == date.getTime();
}
Date.prototype.earlier = function (date) {
    if (Type.GetType(date) != Type.Date) return undefined;

    return this.getTime() < date.getTime();
}
Date.prototype.later = function (date) {
    if (Type.GetType(date) != Type.Date) return undefined;

    return this.getTime() > date.getTime();
}

Array.prototype.notNullItems = function () {
    let arr = [];
    this.forEach(item => {
        if (item != null)
            arr.push(item)
    });
    return arr;
}
Array.prototype.toString = function () {
    let str = "";
    this.forEach(item => {
        str += `${strFormat(item)}, `;
    });
    str = str.substring(0, str.length - 2);
    return `[${str}]`;
}
Array.prototype.sortBoolean = function () {
    let _this = this.filter(item => [Type.Undefined, Type.Boolean].includes(Type.GetType(item)));
    _this.forEach((element, i) => {
        if (Type.GetType(element) == Type.Undefined)
            _this[i] = null;
    });
    return _this.sort((a, b) => {
        if ((a == undefined || typeof a == undefined) && b == false) return -1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    })
}
Array.prototype.equals = function (array) {
    let type = Type.GetType(array), eq = null;
    if (type != Type.Array) return false;
    let _this = this.notNullItems();
    let _arr = array.notNullItems();
    if (_this.length != _arr.length) return false;

    for (let i = 0; i < _this.length; i++) {
        type = Type.GetType(_this[i]);
        if (type != Type.GetType(_arr[i])) return false;

        switch (type) {
            case Type.Date:
            case Type.Array:
            case Type.Object:
            case Type.Function:
                eq = _this[i].equals(_arr[i]);
                break;

            default:
                eq = _this[i] == _arr[i];
                break;
        }

        if (!eq) return false;
    }

    return true;
}
Array.prototype.contains = function (value) {
    let valType = Type.GetType(value);

    switch (valType) {
        case Type.Date:
        case Type.Array:
        case Type.Object:
        case Type.Function:
            return this.filter(item => Type.GetType(item) == valType && item.equals(value)).length > 0;

        default:
            return this.includes(value);
    }
}
Array.prototype.group = function () {
    let arr = [{ [this[0]]: 1 }];
    let i = -1;
    for (let i = 1, key = null, index = -1; i < this.length; i++) {
        key = this[i];
        index = arr.findIndex(item => item[key] != undefined);
        if (index < 0)
            arr.push({ [key]: 1 });
        else
            arr[index][key] += 1;
    }
    return arr;
}
Array.prototype.groupObjectsBy = function (key, countOnly = false) {
    if (Type.GetType(key) != Type.String) return this;

    let obj = this.reduce(function (prev, curr) {
        let _curr = { ...curr };
        delete _curr[key];
        prev[curr[key]] = prev[curr[key]] || [];
        prev[curr[key]].push(_curr);
        return prev;
    }, {});
    let arr = [];

    if (!countOnly)
        return Object.keys(obj).map(key => { return { [key]: obj[key] } });

    return Object.keys(obj).map(key => { return { [key]: obj[key].length } })
}


Object.prototype.notNullItems = function () {
    let _obj = {};
    Object.keys({ ...this }).forEach(key => {
        if (this[key] != null) {
            _obj[key] = this[key];
        }
    });
    return _obj;
}
Object.prototype.isAnyNullOrUndefined = function (props = undefined) {
    let obj = {};
    if (props == null) // it's true either props is undefined
        obj = { ...this };
    else
        props.forEach(prop => obj[prop] = this[prop]);

    for (let prop in obj)
        if (obj[prop] == null) // it's true either props is undefined
            return true;

    return false;
}
Object.prototype.toString = function () {
    let str = "";
    for (let prop in this) {
        if (Type.GetType(this[prop]) != Type.Function)
            str += `${prop}: ${strFormat(this[prop]).toString()}, `;
        else if (!Object.prototype.hasOwnProperty(prop))
            str += `${prop}: ${strFormat(this[prop]).toString()}, `;
    }
    str = str.substring(0, str.length - 2);
    return `{${str}}`;
}
Object.prototype.equals = function (obj) {
    if (Type.GetType(obj) != Type.Object) return false;
    if (Object.keys(this).length != Object.keys(obj).length) return false;

    let type = null, eq = null;
    for (let key in obj) {
        type = Type.GetType(this[key]);
        eq = null;

        switch (type) {
            case Type.Date:
            case Type.Array:
            case Type.Object:
            case Type.Function:
                eq = this[key].equals(obj[key]);
                break;

            default:
                eq = this[key] === obj[key];
                break;
        }

        if (!eq) return false;
    }

    return true;
}

Function.prototype.body = function () {
    let funcStr = this.toString();
    return funcStr.substring(funcStr.indexOf("("));
}
Function.prototype.shortString = function () {
    return `${this.name || "function"} ${this.body().replace(/\r\n/g, '').replace(/\s\s/g, '')}`
}
Function.prototype.equals = function (func) {
    if (func == null) return false;
    if (Type.GetType(func) != Type.Function) return false;

    return this.shortString() == func.shortString();
}

module.exports = { Type, strFormat };