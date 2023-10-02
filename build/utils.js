"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.hasPerfData = void 0;
function hasPerfData(obj) {
    return obj.__perfData !== undefined;
}
exports.hasPerfData = hasPerfData;
var delay = function (time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
};
exports.delay = delay;
