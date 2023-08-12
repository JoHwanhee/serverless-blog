"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
function pipe(...fns) {
    return async (x) => {
        let result = x;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}
exports.pipe = pipe;
