"use strict";
function createWorker(file) {
    var WebWorker = /** @class */ (function () {
        function WebWorker() {
            this._url = URL.createObjectURL(new Blob([file]));
            this._worker = new Worker(this._url);
        }
        WebWorker.prototype.addEventListener = function (type, listener) {
            this._worker.addEventListener(type, listener);
        };
        WebWorker.prototype.removeEventListener = function (type, listener) {
            this._worker.removeEventListener(type, listener);
        };
        WebWorker.prototype.terminate = function () {
            this._worker.terminate();
            URL.revokeObjectURL(this._url);
        };
        WebWorker.prototype.postMessage = function (message, options) {
            this._worker.postMessage(message, options);
        };
        Object.defineProperty(WebWorker.prototype, "onmessage", {
            get: function () {
                return this._worker.onmessage;
            },
            set: function (listener) {
                this._worker.onmessage = listener;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WebWorker.prototype, "onerror", {
            get: function () {
                return this._worker.onerror;
            },
            set: function (listener) {
                this._worker.onerror = listener;
            },
            enumerable: false,
            configurable: true
        });
        return WebWorker;
    }());
    return WebWorker;
}

export default createWorker;
