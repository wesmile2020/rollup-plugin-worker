# rollup-plugin-worker

a rollup plugin for worker

# Usage

Create a `rollup.config.js` and import the plugin:
```javascript
const worker = require('rollup-plugin-worker');

module.exports = {
    plugins: [
        worker({
            prefix: 'worker!',
            plugins: [],
            uglify: false,
        }),
    ],
};
```

# Options
- prefix: string; default is 'worker!'
- plugins: Plugin[]; Plugins needed in the process of processing worker
- uglify: boolean; default is false; enable uglify?

# Source Code

```javascript
import Worker from 'worker!./workers/worker.js';

const worker = new Worker();
```

### Use in typescript

Create a `typing.d.ts` in project and declare a module:

```typescript
declare module 'worker!*' {
  class WebWorker extends Worker {
    constructor();
  }

  export default WebWorker;
}
```