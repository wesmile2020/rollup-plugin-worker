import { IWorker } from './type';

function createWorker(file: string): typeof IWorker {
    const url = URL.createObjectURL(new Blob([file]));

    class WebWorker implements IWorker {
        private _worker: Worker;

        constructor() {
            this._worker = new Worker(url);
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
            URL.revokeObjectURL(url);
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

    return WebWorker;
}

export default createWorker;
