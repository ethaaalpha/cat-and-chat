"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Rectangle_instances, _Rectangle_refresh;
class Rectangle {
    constructor(iX, iY, width, height, context) {
        _Rectangle_instances.add(this);
        this.X = iX;
        this.Y = iY;
        this.width = width;
        this.height = height;
        this.ctx = context;
        __classPrivateFieldGet(this, _Rectangle_instances, "m", _Rectangle_refresh).call(this);
    }
    moveTo(nX, nY) {
        this.ctx.clearRect(this.X, this.Y, this.width, this.height);
        this.X = nX;
        this.Y = nY;
        __classPrivateFieldGet(this, _Rectangle_instances, "m", _Rectangle_refresh).call(this);
    }
}
_Rectangle_instances = new WeakSet(), _Rectangle_refresh = function _Rectangle_refresh() { this.ctx.fillRect(this.X, this.Y, this.width, this.height); };
