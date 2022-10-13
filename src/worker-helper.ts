function createWorker(file: string): typeof Worker {
    class WebWorker {
        private _worker: Worker;
        private _url: string;

        constructor() {
            this._url = URL.createObjectURL(new Blob([file]));
            this._worker = new Worker(this._url);
        }

        dispatchEvent(event: Event): boolean {
            return this._worker.dispatchEvent(event);
        }

        addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
            this._worker.addEventListener(type, listener, options);
        }

        removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions) {
            this._worker.removeEventListener(type, listener, options);
        }

        postMessage(message: any, options?: any) {
            this._worker.postMessage(message, options);
        }

        terminate() {
            this._worker.terminate();
            URL.revokeObjectURL(this._url);
        }

        get onmessage() {
            return this._worker.onmessage;
        }

        set onmessage(e) {
            this._worker.onmessage = e;
        }

        get onerror() {
            return this._worker.onerror;
        }

        set onerror(e) {
            this._worker.onerror = e;
        }

        get onmessageerror() {
            return this._worker.onmessageerror;
        }

        set onmessageerror(e) {
            this._worker.onmessageerror = e;
        }
    }

    return WebWorker as unknown as (typeof Worker);
}

export default createWorker;
